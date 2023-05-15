import {memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {useSubscribe} from 'whip-sdk-react';
import './App.css';
import VideoInfo from './VideoInfo';
import { getVideoStats } from './util';



const Subscriber = (props: { streamId: string, token: string, muteVideo: boolean, muteAudio: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const subscriber = useRef(useSubscribe(props.token)).current;
  const [ iceState, setIceState ] = useState("");
  const [ resolution, setResolution ] = useState("");
  const [ frameRate, setFrameRate ] = useState("");
  const [ codeRate, setCodeRate ] = useState("");
  const [ volume, setVolume ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");

  // 获取音频和视频流的resolution、frameRate、codeRate、volume状态，并获取ice connectState
  const getStats = useCallback(async (stream: MediaStream) => {
    const pc = await subscriber.getPeerConnection();
    // 获取PeerConnection的ice连接状态
    setIceState(pc.iceConnectionState);
    const stats = await pc.getStats();
    stats.forEach((value, key) => {
      if (value.type === 'inbound-rtp' && value.mediaType === 'audio') {
        const { audioLevel } = value;
        // 保留两位小数
        setVolume(audioLevel.toFixed(2));
      }
    });
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      const videoStats = await getVideoStats(pc, videoTrack);
      setCodeRate(videoStats.vbps.toString());
      setFrameRate(videoStats.fps);
      setResolution(videoStats.resolution);
    }
  }, [subscriber]);


  useEffect(() => {
    const stream = subscriber.subscribe();
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }

    setInterval(() => {
      getStats(stream);
    }, 1000);
    return () => {
      subscriber.unsubscribe()
    };
  }, [])

  useLayoutEffect(() => {
    if (videoRef.current?.srcObject) {
      subscriber.mute(props.muteVideo, 'video');
    }
  }, [props.muteVideo])

  useLayoutEffect(() => {
    if (videoRef.current?.srcObject) {
      subscriber.mute(props.muteAudio, 'audio');
    }
  }, [props.muteAudio])

  return (
    <>
      <video className="renderDom" autoPlay playsInline ref={videoRef} controls />
      <VideoInfo codeRate={codeRate} frameRate={frameRate} iceState={iceState} volume={volume} resolution={resolution} errorMessage={errorMessage} />
    </>
  );
};

export default memo(Subscriber);
