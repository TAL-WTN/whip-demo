import {useCallback, useEffect, useState} from 'react';
import {
  Button,
  Space,
  Switch,
  Input,
  Message,
  PageHeader,
} from "@arco-design/web-react";
import { v4 as uuid } from "uuid";
import {generateToken, getUrlPrmt} from './util';
// import {useSubscribe} from './whip-sdk-react/dist/index';
// import useSubscribe from './UseSubscribe';
import Subscriber from './Subscriber';
import './App.css';
import getToken from './getToken';

function App() {
  const queryObject = getUrlPrmt();

  const [ mode, setMode ] = useState("pull");
  const [ Domain, setDomain ] = useState(queryObject.Domain || window.location.host);
  const [ AppID, setAppID ] = useState(queryObject.AppID || "bc22d5");
  const [ AppKey, setAppKey ] = useState(queryObject.AppKey || "00eec858271ea752");
  const [ StreamID, setStreamID ] = useState(queryObject.StreamID || uuid());
  const [ SessionID, setSessionID] = useState(queryObject.SessionID || uuid());
  const [ pullUrl, setPullUrl ] = useState("");
  const [ pushUrl, setPushUrl ] = useState(window.location.origin);
  const [ visibility, setVisibility ] = useState(false);
  const [ MuteAudio, setMuteAudio ] = useState(false);
  const [ MuteVideo, setMuteVideo ] = useState(false);
  const [ PullAuth, setPullAuth ] = useState(true);
  const [ ClientIp, setClientIp ] = useState("");
  const [ iceState, setIceState ] = useState("");
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
  const [ token, setToken ] = useState<string>();

  const startPull = useCallback(async () => {
    const pullToken = await generateToken({AppID, AppKey, StreamID, Action: 'sub'});
    setToken(pullToken);
    setVisibility(true);
  }, [AppID, AppKey, StreamID]);

  const handleMute = useCallback((mute: boolean, kind: 'video' | 'audio') => {
    switch (kind) {
      case 'video':
        setMuteVideo(mute);
        break;
      case 'audio':
        setMuteAudio(mute);
        break;
    }
  }, [StreamID]);
  return (
    <div className="Page">
      <PageHeader title="Welcome to the WTN Demo" className="Header" />
      <div className="Contrainer">
        <div className="Contrainer-left">
          <Space direction="vertical" size="medium">
            <div>
              <div className="Basic-message">
                <span>Domain: </span>
              </div>
              <Input
                id="Domain"
                onChange={(value) => {
                  setDomain(value);
                }}
                value={Domain}
                placeholder="请输入Domain"
                style={{ width: 300 }}
              />
            </div>
            <div>
              <div className="Basic-message">
                <span>AppID：</span>
              </div>
              <Input
                id="AppID"
                onChange={(value) => {
                  setAppID(value);
                }}
                value={AppID}
                placeholder="请输入AppID"
                style={{ width: 300 }}
              />
            </div>
            <div>
              <div className="Basic-message">
                <span>AppKey：</span>
              </div>
              <Input
                id="AppKey"
                onChange={(value) => {
                  setAppKey(value);
                }}
                value={AppKey}
                placeholder="请输入AppKey"
                style={{ width: 300 }}
              />
            </div>

            <div>
              {/* <Space> */}
              <div className="Basic-message">
                <span>StreamID：</span>
              </div>
              <Input
                id="StreamID"
                style={{ width: 300, marginRight: 10 }}
                value={StreamID}
                onChange={(v) => setStreamID(v)}
                placeholder="StreamID"
              />
              <Button
                id="StreamID_Random"
                onClick={() => setStreamID(uuid())}
              >
                Random
              </Button>
            </div>
            <div>
              <div className="Basic-message">
                <span>SessionID:</span>
              </div>
              <Input
                id="SessionID"
                style={{ width: 300, marginRight: 10 }}
                value={SessionID}
                onChange={(v) => setSessionID(v)}
                placeholder="SessionID"
              />
              <Button
                id="SessionID_Random"
                onClick={() => setSessionID(uuid())}
              >
                Random
              </Button>
              {/* </Space> */}
            </div>
            {mode === "push" ? (
              <Space direction="vertical">
                <Space>
                  <Button
                    id="StartPush"
                    disabled={visibility}
                    type="primary"
                    onClick={() => {
                      // this.startPush();
                    }}
                  >
                    StartPush
                  </Button>
                  <Button
                    id="StopPush"
                    disabled={!visibility}
                    status="danger"
                    onClick={() => {
                      // this.stop();
                    }}
                  >
                    StopPush
                  </Button>
                  {mode === "push" ? (
                    <Space>
                      <Button
                        id="PullLink"
                        disabled={!visibility}
                        onClick={() => {
                          window.open(pullUrl);
                        }}
                      >
                        PullLink
                      </Button>
                      <Button
                        id="CurrentPushLink"
                        disabled={!visibility}
                        onClick={() => {
                          window.open(pushUrl);
                        }}
                      >
                        CurrentPushLink
                      </Button>
                    </Space>
                  ) : (
                    <div></div>
                  )}
                </Space>
              </Space>
            ) : (
              <Space>
                <Button
                  id="StratPull"
                  disabled={visibility}
                  type="primary"
                  onClick={() => {
                    startPull();
                  }}
                >
                  Start Pull
                </Button>
                <Button
                  id="StopPull"
                  disabled={!visibility}
                  status="danger"
                  onClick={() => {
                    setToken(undefined);
                    setVisibility(false);
                    // subscriber && subscriber.stop();
                  }}
                >
                  Stop Pull
                </Button>
              </Space>
            )}
          </Space>
        </div>
        {/* <div className="Contrainer-right"> */}
        {/* <div
            className="Contrainer-right-video"
            ref={(r) => (this.videoRenderDom = r)}></div> */}
        <div
          style={{
            width: 680,
            height: 365,
            display: "flex",
            flexWrap: "wrap",
            background: "#D3D3D3",
            marginTop: -55,
          }}
        >
          {/*<div*/}
          {/*  style={{ width: 480, height: 375, marginTop: -5 }}*/}
          {/*  // ref={(r) => (this.videoRenderDom = r)}*/}
          {/*></div>*/}
          {token && mode === 'pull' ? <Subscriber token={token} MuteVideo={MuteVideo} MuteAudio={MuteAudio}/> : <></>}

          <div style={{ width: 200, height: 360 }}>
            <div
              className="Video-info"
              style={{
                marginTop: -14,
                marginLeft: 20,
                padding: 10,
                paddingTop: 0,
              }}
            >
              <p>
                <b>Info: </b>
              </p>
              <p id="ICE">Conn State：{iceState}</p>
              <p id="Resolution">
                Resolution：
                {resolution === "undefined*undefined"
                  ? "读取中"
                  : resolution}
              </p>
              <p id="FrameRate">
                Frame Rate：
                {frameRate === "undefined"
                  ? "读取中"
                  : frameRate}
              </p>
              <p id="VideoBitrate">Video Bitrate：{codeRate}</p>
              <p id="Volume">Volume：{volume}</p>
              <p id="ErrorMessage" style={{ color: "red" }}>
                {errorMessage
                  ? `错误信息：${errorMessage}`
                  : ""}
              </p>
            </div>
          </div>
          <div>
            <Space>
              MuteVideo：
              <Switch
                id="MuteVideo"
                checked={MuteVideo}
                onChange={async (v) => {
                  handleMute(v, 'video');
                }}
              ></Switch>
              MuteAudio：
              <Switch
                id="MuteAudio"
                checked={MuteAudio}
                onChange={async (v) => {
                  handleMute(v, 'audio');
                }}
              ></Switch>
            </Space>
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}

export default App;
