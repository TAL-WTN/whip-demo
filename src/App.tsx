import { useState } from 'react';
import {
  Button,
  Space,
  Switch,
  Input,
  Message,
  PageHeader,
} from "@arco-design/web-react";
import { v4 as uuid } from "uuid";
import { getUrlPrmt } from './util';
import './App.css';

function App() {
  const queryObject = getUrlPrmt();

  const [ mode, setMode ] = useState("push");
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
                allowClear
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
                allowClear
              />
              <Button
                id="SessionID_Random"
                onClick={() => setSessionID(uuid())}
              >
                Random
              </Button>
              {/* </Space> */}
            </div>
            <div>
              <Space>
                PullAuth：
                <Switch
                  id="pullAuthentication"
                  checked={PullAuth}
                  onChange={(v) => setPullAuth(v)}
                />
                <span>|</span>
                ClientIP:
                <Input
                  id="ClientIP"
                  style={{ width: 150 }}
                  value={ClientIp}
                  onChange={(v) => setClientIp(v)}
                  placeholder="ClientIp"
                  allowClear
                />
              </Space>
            </div>
            {mode === "push" ? (
              <Space direction="vertical">
                <Space>
                  <Button
                    id="StartPush"
                    disabled={visibility}
                    type="primary"
                    onClick={() => {
                      this.startPush();
                    }}
                  >
                    StartPush
                  </Button>
                  <Button
                    id="StopPush"
                    disabled={!visibility}
                    status="danger"
                    onClick={() => {
                      this.stop();
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
                    this.startPull();
                  }}
                >
                  Start Pull
                </Button>
                <Button
                  id="StopPull"
                  disabled={!visibility}
                  status="danger"
                  onClick={() => {
                    this.stop();
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
          <div
            style={{ width: 480, height: 375, marginTop: -5 }}
            ref={(r) => (this.videoRenderDom = r)}
          ></div>
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
              <p id="ICE">Conn State：{this.state.iceState}</p>
              <p id="DTLS">DTLS State：{this.state.dtlsVideoState}</p>
              <p id="Resolution">
                Resolution：
                {this.state.resolution === "undefined*undefined"
                  ? "读取中"
                  : this.state.resolution}
              </p>
              <p id="FrameRate">
                Frame Rate：
                {this.state.frameRate === "undefined"
                  ? "读取中"
                  : this.state.frameRate}
              </p>
              <p id="VideoBitrate">Video Bitrate：{this.state.codeRate}</p>
              <p id="Volume">Volume：{this.state.volume}</p>
              <p id="ErrorMessage" style={{ color: "red" }}>
                {this.state.errorMessage
                  ? `错误信息：${this.state.errorMessage}`
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
                  this.setState({ MuteVideo: v });
                  const { MuteAudio } = this.state;
                  if (this.state.dtlsVideoState === "connected") {
                    const unlock = await this._pubLock.lock();
                    updateRequest(this.location!, {
                      MuteAudio,
                      MuteVideo: v,
                    });
                    unlock();
                  }
                }}
              ></Switch>
              MuteAudio：
              <Switch
                id="MuteAudio"
                checked={MuteAudio}
                onChange={async (v) => {
                  this.setState({ MuteAudio: v });
                  const { MuteVideo } = this.state;
                  if (this.state.dtlsVideoState === "connected") {
                    const unlock = await this._pubLock.lock();
                    updateRequest(this.location!, {
                      MuteAudio: v,
                      MuteVideo,
                    });
                    unlock();
                  }
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
