import {memo, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import { Message } from "@arco-design/web-react";

import { v4 as uuid } from "uuid";
import { PromiseLock, getAudioStats, getVideoStats, sleep } from './util';
import { usePublish } from "whip-sdk-react";
import VideoInfo from './VideoInfo';

function Publisher(props: {streamId: string,  token: string, muteVideo: boolean, muteAudio: boolean}) {
  const _pubLock = new PromiseLock();

  if (!props.token) {
    throw new Error("Token is required")
  }
  const SessionID = useRef(uuid()).current;

  const [ StreamID, setStreamID ] = useState(props.streamId || uuid());
  const [ pushState, setPushState ] = useState(false);
  const [ iceState, setIceState ] = useState("");
  const [ resolution, setResolution ] = useState("");
  const [ frameRate, setFrameRate ] = useState("");
  const [ codeRate, setCodeRate ] = useState("");
  const [ volume, setVolume ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ audio, setAudio ] = useState<MediaStreamTrack | null>(null);
  const [ video, setVideo ] = useState<MediaStreamTrack | null>(null);
  const { publish, mute, unpublish, getPeerConnection } = useRef(usePublish(props.token)).current;

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
    const pc = getPeerConnection();
    const audioStats = await getAudioStats(pc, audio);
    const videoStats = await getVideoStats(pc, video);
    setVolume(audioStats.volume);
    setCodeRate(videoStats.vbps.toString());
    setFrameRate(videoStats.fps);
    setResolution(videoStats.resolution);
    await sleep(1000);
    startStatsLoop(audio, video);

    setIceState(pc.iceConnectionState);
  }

  useEffect(() => {
    startPush().then(() => {
      setPushState(true);
    });
    return () => {
      stopPush().then(() => {
        setPushState(false);
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      video?.stop();
      audio?.stop();
    };
  }, [video,audio]);

  useLayoutEffect(() => {
    if (pushState && audio && video) {
      startStatsLoop(audio, video)
    }
  }, [pushState])

  useLayoutEffect(() => {
    console.log(pushState, props.muteVideo, 'props.muteVideo');
    if (pushState) {
      mute(props.muteVideo, 'video');
    }
  }, [props.muteVideo])

  useLayoutEffect(() => {
    console.log(pushState, props.muteAudio, 'props.muteAudio');
    if (pushState) {
      mute(props.muteAudio, 'audio');
    }
  }, [props.muteAudio])

  return (
    <>
      <video className="renderDom" autoPlay playsInline ref={videoRef} muted></video>
      <VideoInfo codeRate={codeRate} frameRate={frameRate} iceState={iceState} volume={volume} resolution={resolution} errorMessage={errorMessage} />
    </>
  );
}

export default memo(Publisher);
