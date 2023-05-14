import {useState, useCallback} from 'react';
import {
  PageHeader,
  Grid, Input, Space, Button,
} from '@arco-design/web-react';
import { v4 as uuid } from "uuid";
import { generateToken, getUrlPrmt } from './util';
import Publisher from './Publisher';
import Subscriber from './Subscriber';
import {IconRefresh, IconVideoCamera, IconVoice} from '@arco-design/web-react/icon';
import {AppID, AppKey} from './config';
import './App.css';

const Row = Grid.Row;
const Col = Grid.Col;

enum PushState {
  stopped,
  pushing,
  pushed,
}

enum PullState {
  stopped,
  pulling,
  pulled,
}

function App() {
  const queryObject = getUrlPrmt();

  const [ StreamID, setStreamID ] = useState(queryObject.StreamID || uuid());
  const [ pubToken, setPubToken ] = useState("");
  const [ subToken, setSubToken ] = useState("");
  const [ pushState, setPushState ] = useState<PushState>(PushState.stopped);
  const [ pullState, setPullState ] = useState<PullState>(PullState.stopped);
  const [ muteLocalVideo, setMuteLocalVideo ] = useState(false);
  const [ muteLocalAudio, setMuteLocalAudio ] = useState(false);
  const [ muteRemoteVideo, setMuteRemoteVideo ] = useState(false);
  const [ muteRemoteAudio, setMuteRemoteAudio ] = useState(false);

  const handleMuteRemote = useCallback((mute: boolean, kind: 'video' | 'audio') => {
    switch (kind) {
      case 'video':
        setMuteRemoteVideo(mute);
        break;
      case 'audio':
        setMuteRemoteAudio(mute);
        break;
    }
  }, []);
  const handleMuteLocal = useCallback((mute: boolean, kind: 'video' | 'audio') => {
    switch (kind) {
      case 'video':
        setMuteLocalVideo(mute);
        break;
      case 'audio':
        setMuteLocalAudio(mute);
        break;
    }
  }, []);

  const handlePubBtnClick = useCallback(() => {
    if (pushState === PushState.pushed) {
      setPubToken("");
      setPushState(PushState.stopped);
      return;
    }
    setPushState(PushState.pushing);
    generateToken({
      AppID,
      StreamID,
      Action: "pub",
      PullAuth: true,
      AppKey,
    }).then((token) => {
      setPubToken(token);
      setPushState(PushState.pushed);
    }).catch(() => {
      setPushState(PushState.stopped);
    })
  }, []);
  const handleSubBtnClick = useCallback(() => {
    console.log('handleSubBtnClick', pullState);
    if (pullState === PullState.pulled) {
      setSubToken("");
      setPullState(PullState.stopped);
      return;
    }
    setPullState(PullState.pulling);

    generateToken({
      AppID,
      StreamID,
      Action: "sub",
      AppKey,
    }).then((token) => {
      setSubToken(token);
      setPullState(PullState.pulled);
    }).catch(() => {
      setPullState(PullState.stopped);
    })
  }, [pullState]);
  return (
    <div className="Page">
      <PageHeader title="Welcome to the WTN Demo" className="Header" style={{color: '#FFF'}} />

      <Row justify='center'>
          <div className="Basic-message">
            <span style={{color: '#FFF'}}>StreamID：</span>
          </div>
          <Input
            id="StreamID"
            style={{width: 300, marginRight: 10}}
            value={StreamID}
            onChange={(v) => setStreamID(v)}
            placeholder="StreamID"
            suffix={<IconRefresh onClick={() => setStreamID(uuid())}/>}
          />
      </Row>
      <Space direction='vertical' />

      <Row justify='center'>
        <Col span={8} >
          <div className="Stream-container" id="publish">
            <div className="Video-container">
              {pubToken && <Publisher streamId={StreamID} token={pubToken}></Publisher>}
            </div>
            <Space className="Button-mute-group">
              <IconVideoCamera style={{fontSize: 36, color: muteLocalVideo ? '#b6b6b6' : '#FFF'}}
                 onClick={() => {
                   handleMuteLocal(!muteLocalVideo, 'video');
                 }}
              />
              <IconVoice style={{fontSize: 30, color: muteLocalAudio ? '#b6b6b6' : '#FFF'}}
               onClick={() => {
                 handleMuteLocal(!muteLocalAudio, 'audio');
               }}
              />
            </Space>
            <div className="Contrainer-bottom">
              <Space direction="horizontal" size="medium">
                <Button className="Button-push" type="primary" onClick={handlePubBtnClick} disabled={pushState === PushState.pushing}>
                  {pushState === PushState.pushed ? 'Stop Push' : 'Start Push'}
                </Button>
              </Space>
            </div>
          </div>
        </Col>
        <Col span={8} offset={1}>
          <div className="Stream-container" id="subscribe">
            <div className="Video-container">
              {subToken && <Subscriber streamId={StreamID} token={subToken} muteAudio={muteRemoteAudio} muteVideo={muteRemoteVideo}></Subscriber>}
            </div>
            <Space className="Button-mute-group">
              <IconVideoCamera style={{fontSize: 36, color: muteRemoteVideo ? '#b6b6b6' : '#FFF'}}
               onClick={() => {
                 handleMuteRemote(!muteRemoteVideo, 'video');
               }}
              />
              <IconVoice style={{fontSize: 30, color: muteRemoteAudio ? '#b6b6b6' : '#FFF'}}
               onClick={() => {
                 handleMuteRemote(!muteRemoteAudio, 'audio');
               }}
              />
            </Space>
            <div className="Contrainer-bottom">
              <Space direction="horizontal" size="medium">
                <Button className="Button-push" type="primary" onClick={handleSubBtnClick} disabled={pullState === PullState.pulling}>
                  {pullState === PullState.pulled ? 'Stop Pull' : 'Start Pull'}
                </Button>
              </Space>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
