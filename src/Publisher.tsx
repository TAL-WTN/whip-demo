import {useCallback, useEffect, useRef, useState} from 'react';
import { Button, Space, Switch, Input, Message } from "@arco-design/web-react";
import {IconRefresh, IconVideoCamera, IconVoice} from '@arco-design/web-react/icon';

import { v4 as uuid } from "uuid";
import { PromiseLock, getAudioStats, getVideoStats, sleep } from './util';
import { usePublish } from "whip-sdk-react";

function Publisher(props: {appId?: string, appKey?: string, streamId?: string, PullAuth?: boolean, parameter?: string, token: string}) {
  const _pubLock = new PromiseLock();

  if (!props.token) {
    throw new Error("Token is required")
  }
  const SessionID = useRef(uuid()).current;

  const [ StreamID, setStreamID ] = useState(props.streamId || uuid());
  const [ pushState, setPushState ] = useState(false);
  const [ MuteAudio, setMuteAudio ] = useState(false);
  const [ MuteVideo, setMuteVideo ] = useState(false);
  const [ iceState, setIceState ] = useState("");
  const [ resolution, setResolution ] = useState("");
  const [ frameRate, setFrameRate ] = useState("");
  const [ codeRate, setCodeRate ] = useState("");
  const [ volume, setVolume ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ audio, setAudio ] = useState<MediaStreamTrack | null>(null);
  const [ video, setVideo ] = useState<MediaStreamTrack | null>(null);

  const { publish, mute, unpublish, getPeerConnection } = usePublish(props.token);

  const startCapture = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })

    const audio = stream.getAudioTracks()[0];
    const video = stream.getVideoTracks()[0];

    if (!audio) {
      throw new Error("获取麦克风失败")
    }

    if (!video) {
      throw new Error("获取摄像头失败")
    }

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
    return { audio, video };
  }
  const startPush = useCallback(async () => {
    if (!StreamID || !SessionID) {
      setErrorMessage("参数不全");
      Message.error("参数不全");
      return;
    }
    const { audio, video } = await startCapture();
    setAudio(audio);
    setVideo(video);
    await publish(audio, video);
    setPushState(true);
  }, [StreamID, SessionID, publish])

  const stopPush = useCallback( async () => {
    await unpublish();
    setPushState(false);
    audio?.stop();
    video?.stop();
    videoRef.current && (videoRef.current.srcObject = null);
  }, [video, audio])

  const startStatsLoop = async (audio: MediaStreamTrack, video: MediaStreamTrack) => {
    if (!pushState) {
      return;
    }
    const audioStats = await getAudioStats(getPeerConnection(), audio);
    const videoStats = await getVideoStats(getPeerConnection(), video);
    setVolume(audioStats.volume);
    setCodeRate(videoStats.vbps.toString());
    setFrameRate(videoStats.fps);
    setResolution(videoStats.resolution);

    await sleep(1000);
    startStatsLoop(audio, video);
  }

  const handleMute = useCallback(async(isMute: boolean, kind: 'video' | 'audio') => {
    console.log(video);
    switch (kind) {
      case 'video':
        setMuteVideo(isMute);
        // // @ts-ignore
        // video?.enabled = isMute;
        break;
      case 'audio':
        setMuteAudio(isMute);
        // // @ts-ignore
        // audio?.enabled = isMute;
        break;
    }
    const unlock = await _pubLock.lock();
    await mute(isMute, kind);
    unlock();
    // if (dtlsAudioState === "connected") {
    //     // TODO
    // }
  }, [video, audio]);

  useEffect(() => {
    if (pushState && audio && video) {
      startStatsLoop(audio, video)
    }
  }, [ pushState, audio, video ])


  const handlePubBtnClick = useCallback(() => {
    if (pushState) {
      stopPush();
    } else {
      startPush();
    }
  }, [pushState])
  return (
    <>
      <video className="renderDom" autoPlay playsInline ref={videoRef} muted></video>
      <div className="Video-info">
        <p id="ICE">Conn State：{iceState}</p>
        <p id="Resolution">
          Resolution：
          {resolution === 'undefined*undefined'
            ? '读取中'
            : resolution}
        </p>
        <p id="FrameRate">
          Frame Rate：
          {frameRate === 'undefined'
            ? '读取中'
            : frameRate}
        </p>
        <p id="VideoBitrate">Video Bitrate：{codeRate}</p>
        <p id="Volume">Volume：{volume}</p>
        <p id="ErrorMessage" style={{color: 'red'}}>
          {errorMessage
            ? `错误信息：${errorMessage}`
            : ''}
        </p>
      </div>
    </>
  );
}

export default Publisher;
