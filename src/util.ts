// Copyright 2022 ByteDance Ltd. and/or its affiliates.
// SPDX-License-Identifier: BSD-3-Clause

import { sign } from "jsonwebtoken";
export interface TokenParameters {
  AppID: string;
  StreamID: string;
  Action: string;
  PullAuth?: boolean;
  AppKey?: string;
}

// 生成token
export async function generateToken({
  AppID,
  StreamID,
  Action,
  PullAuth,
  AppKey,
}: TokenParameters) {
  // return AppID;
  const payload: any = {
    version: "1.0",
    appID: AppID,
    streamID: StreamID,
    action: Action,
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  if (Action === "pub") {
    payload.enableSubAuth = !!PullAuth;
  }
  return sign(payload, AppKey || "", {
    noTimestamp: true,
    header: {
      typ: "JWT",
      alg: "HS256",
    }
  });
}

// 解析URL参数
export function getUrlPrmt(url?: string): { [v: string]: string } {
  url = url ? url : window.location.href;
  let _pa = url.substring(url.indexOf("?") + 1);
  let _arrS = _pa.split("&");
  let _rs: any = {};
  for (let i = 0, _len = _arrS.length; i < _len; i++) {
    let pos = _arrS[i].indexOf("=");
    if (pos === -1) {
      continue;
    }

    let name = _arrS[i].substring(0, pos),
      value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
    _rs[name] = value;
  }
  return _rs;
}

// 锁
let lockId = 1;
export class PromiseLock {
  private lockingPromise: Promise<void> = Promise.resolve();
  private locks = 0;
  private name = "";
  private lockId: number;

  public constructor(name?: string) {
    this.lockId = lockId++;
    if (name) {
      this.name = name;
    }
  }

  public get isLocked(): boolean {
    return this.locks > 0;
  }

  public lock(): Promise<() => void> {
    this.locks += 1;
    let unlockNext: () => void;
    const willLock: Promise<void> = new Promise((resolve) => {
      unlockNext = () => {
        this.locks -= 1;
        resolve();
      };
    });
    const willUnlock = this.lockingPromise.then(() => unlockNext);
    this.lockingPromise = this.lockingPromise.then(() => willLock);
    return willUnlock;
  }
}
