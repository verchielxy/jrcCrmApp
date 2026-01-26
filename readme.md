# UniApp VUE3

这是一个关于 Vue3 版本的，基于 Vite 的前端脚手架，集成了 AntDesignV4、vuex、router等前端框架和组件。

[![Test Status](https://raw.githubusercontent.com/verchielxy/verchielxy/refs/heads/master/images/github/test.svg)](https://github.com/verchielxy/leviathan)
[![Lint Status](https://raw.githubusercontent.com/verchielxy/verchielxy/refs/heads/master/images/github/lint.svg)](https://github.com/verchielxy/leviathan)
[![Latest Stable Version](https://raw.githubusercontent.com/verchielxy/verchielxy/refs/heads/master/images/github/stable.svg)](https://github.com/verchielxy/leviathan)
[![Latest Unstable Version](https://raw.githubusercontent.com/verchielxy/verchielxy/refs/heads/master/images/github/unstable.svg)](https://github.com/verchielxy/leviathan)
[![License](https://raw.githubusercontent.com/verchielxy/verchielxy/refs/heads/master/images/github/lincense.svg)](https://github.com/verchielxy/leviathan)

## 环境需求

- [Vue3](https://cn.vuejs.org/) >= 3.4.21
- [Npm](https://www.npmjs.com/) >= 10.7.0

## 证书生成

```bash
# 证书生成
keytool -genkey -v -keystore android.keystore -alias mykeyalias -keyalg RSA -keysize 2048 -validity 10000

# 查看证书
keytool -list -v -keystore android.keystore

# 证书密码
123456
```

## 打包apk流程

```bash
# 发行 选择传统打包
# 包名举例
com.xy.jrc.crm.platform
```

## HBuilder 打包需要将node加入到 .bash_profile

```bash
# 打开~/.bash_profile
sudo vi ~/.bash_profile

# 写入
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH="$HOME/.nvm/versions/node/v23.11.1/bin:$PATH"

# 生效
source ~/.bash_profile
```
