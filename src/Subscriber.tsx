import {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useSubscribe} from 'whip-sdk-react';
import './App.css';
import {Button, Input, Space} from '@arco-design/web-react';
import {IconRefresh, IconVideoCamera, IconVoice} from '@arco-design/web-react/icon';
import {v4 as uuid} from 'uuid';
import {generateToken} from './util';

const Subscriber = (props: { streamId: string, appKey: string, appId: string, token: string }) => {
  const [videoStream, setVideoStream] = useState<MediaStream>();
  // const subscriber = useSubscribe(props.token);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [ AppID, setAppID ] = useState(props.appId);
  const [ AppKey, setAppKey ] = useState(props.appKey);
  const [ StreamID, setStreamID ] = useState(props.streamId || uuid());

  const [ MuteAudio, setMuteAudio ] = useState(false);
  const [ MuteVideo, setMuteVideo ] = useState(false);
  const [ PullAuth, setPullAuth ] = useState(true);
  const [ ClientIp, setClientIp ] = useState("");
  const [ iceState, setIceState ] = useState("");
  const [ pullState, setPullState ] = useState(false);
  const [ dtlsAudioState, setDtlsAudioState ] = useState("");
  const [ dtlsVideoState, setDtlsVideoState ] = useState("");
  const [ captureResolution, setCaptureResolution ] = useState("");
  const [ resolution, setResolution ] = useState("");
  const [ frameRate, setFrameRate ] = useState("");
  const [ codeRate, setCodeRate ] = useState("");
  const [ volume, setVolume ] = useState("");
  const [ parameter, setParameter ] = useState("");
  const [ requestList, setRequestList ] = useState([]);
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ visibility, setVisibility ] = useState(false);
  const [ token, setToken ] = useState<string>();



  const handleMute = useCallback((mute: boolean, kind: 'video' | 'audio') => {
    switch (kind) {
      case 'video':
        setMuteVideo(mute);
        // subscriber.mute(mute, 'video');
        break;
      case 'audio':
        setMuteAudio(mute);
        // subscriber.mute(mute, 'audio');
        break;
    }
  }, []);
  //
  // useEffect(() => {
  //   // return () => {
  //   //   subscriber.stop();
  //   // };
  // }, [props.token])
  //
  //
  // useEffect(() => {
  //   if (subscriber.videoTrack) {
  //     const stream = new MediaStream();
  //     stream.addTrack(subscriber.videoTrack);
  //     setVideoStream(stream);
  //   }
  // }, [subscriber.videoTrack]);
  //
  // useEffect(() => {
  //   if(videoRef.current && videoStream) {
  //     videoRef.current.srcObject = videoStream;
  //   }
  // }, [videoRef, videoStream]);

  const handleSubBtnClick = useCallback(async () => {
    if(visibility) {
      setToken('');
      setVisibility(false);
    } else {
      //step 1: start subscribe
      const pullToken = await generateToken({AppID, AppKey, StreamID, Action: 'sub'});
      setToken(pullToken);
      setVisibility(true);
    }
  }, [AppID, AppKey, StreamID, visibility]);


  return (
    <div className="Stream-container">
      <div className="Video-container">
        <video className="renderDom" autoPlay playsInline ref={videoRef} muted></video>
      </div>
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
      <Space className="Button-mute-group">
        <IconVideoCamera style={{fontSize: 36, color: MuteVideo ? '#b6b6b6' : '#FFF'}}
           onClick={() => {
             handleMute(!MuteVideo, 'video');
           }}
        />
        <IconVoice style={{fontSize: 30, color: MuteAudio ? '#b6b6b6' : '#FFF'}}
           onClick={() => {
             handleMute(!MuteAudio, 'audio');
           }}
        />
      </Space>
      <div className="Contrainer-bottom">
        <Space direction="horizontal" size="medium">
          <Button className="Button-push" type="primary" onClick={handleSubBtnClick}>
            {pullState ? 'Stop Pull' : 'Start Pull'}
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default memo(Subscriber);
