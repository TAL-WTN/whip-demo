import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useSubscribe} from 'whip-sdk-react';
import './App.css';

const Subscriber = (props: { token: string, MuteVideo: boolean, MuteAudio: boolean }) => {
  const [ MuteAudio, setMuteAudio ] = useState(false);
  const [ MuteVideo, setMuteVideo ] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream>();
  const subscriber = useSubscribe(props.token);
  const videoRef = useRef<HTMLVideoElement>(null);

  // useEffect(() => {
  //   return () => {
  //     subscriber.stop();
  //   };
  // }, [subscriber])

  useEffect(() => {
    setMuteVideo(props.MuteVideo);
  }, [props.MuteVideo])


  useEffect(() => {
    setMuteAudio(props.MuteAudio);
  }, [props.MuteAudio])

  useEffect(() => {
    console.log('subscriber.videoTrack', subscriber.videoTrack);

    if (subscriber.videoTrack) {
      const stream = new MediaStream();
      stream.addTrack(subscriber.videoTrack);
      setVideoStream(stream);
    }
  }, [subscriber.videoTrack]);

  useEffect(() => {
    if(videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoRef, videoStream]);


  const handleMuteRemoteAudio = useCallback((mute: boolean) => {
    setMuteAudio(mute);
  }, [MuteAudio]);
  const handleMuteRemoteVideo = useCallback((mute: boolean) => {
    setMuteAudio(mute);
  }, [MuteVideo]);

  return (
    <div
      style={{ width: 480, height: 375, marginTop: -5 }}
      // ref={(r) => (this.videoRenderDom = r)}
    >
      <video
        className="renderDom"
        ref={videoRef}
        autoPlay
        muted
        playsInline
      />
    </div>
  );
};

export default React.memo(Subscriber);
