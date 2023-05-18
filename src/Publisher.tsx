import {memo, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import { Message } from "@arco-design/web-react";
import { usePublish } from "whip-sdk-react";
import VideoInfo from './VideoInfo';

function Publisher(props: {streamId: string,  token: string, muteVideo: boolean, muteAudio: boolean}) {
  if (!props.token) {
    throw new Error("Token is required")
  }

  const [ pushState, setPushState ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ audio, setAudio ] = useState<MediaStreamTrack | null>(null);
  const [ video, setVideo ] = useState<MediaStreamTrack | null>(null);
  const [ stream, setStream ] = useState<MediaStream | undefined>();
  const [ pc, setPc ] = useState<RTCPeerConnection | undefined>();

  const videoRef = useRef<HTMLVideoElement>(null);
  // step 1: call usePublish hook to get publish function
  const { publish, mute, unpublish, getPeerConnection } = useRef(usePublish(props.token)).current;

  // step 2: call getUserMedia to get audio and video stream
  const startCapture = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })

    setStream(stream);
    const audio = stream.getAudioTracks()[0];
    const video = stream.getVideoTracks()[0];

    if (!audio) {
      throw new Error("Failed to get audio track");
    }

    if (!video) {
      throw new Error("Failed to get video track")
    }

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
    return { audio, video };
  }

  // step 3: call publish function to publish stream
  const startPush = useCallback(async () => {
    if (!props.streamId) {
      setErrorMessage("StreamId is required");
      Message.error("StreamId is required");
      return;
    }
    const { audio, video } = await startCapture();
    setAudio(audio);
    setVideo(video);
    await publish(audio, video);
    setPc(getPeerConnection());
    setPushState(true);
  }, [props.streamId, publish])

  // step 4: call unpublish function to stop publish stream
  const stopPush = useCallback( async () => {
    await unpublish();
    setPushState(false);
    audio?.stop();
    video?.stop();
    videoRef.current && (videoRef.current.srcObject = null);
  }, [video, audio, unpublish])

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

  // mute video
  useLayoutEffect(() => {
    console.log(pushState, props.muteVideo, 'props.muteVideo');
    if (pushState) {
      mute(props.muteVideo, 'video');
    }
  }, [props.muteVideo, mute, pushState])
  // mute audio
  useLayoutEffect(() => {
    console.log(pushState, props.muteAudio, 'props.muteAudio');
    if (pushState) {
      mute(props.muteAudio, 'audio');
    }
  }, [props.muteAudio, mute, pushState])

  return (
    <>
      <video className="renderDom" autoPlay playsInline ref={videoRef} muted></video>
      <VideoInfo pc={pc} stream={stream} errorMessage={errorMessage} />
    </>
  );
}

export default memo(Publisher);
