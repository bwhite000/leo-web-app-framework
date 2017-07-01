"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StreamController {
    constructor({ onListen = () => { }, onCancel = () => { } } = {}) {
        this.stream = new Stream(this);
        this.onListenListener = onListen;
        this.onCancelListener = onCancel;
    }
    add(data) {
        this.stream.add(data);
    }
    get onListen() {
        return this.onListenListener;
    }
    get onCancel() {
        return this.onCancelListener;
    }
}
exports.StreamController = StreamController;
class StreamSubscription {
    constructor(streamController) {
        this.streamController = streamController;
    }
    cancel() {
        this.streamController.onCancel();
        this.onData = null;
        this.onError = null;
    }
}
exports.StreamSubscription = StreamSubscription;
class Stream {
    constructor(streamController) {
        this.streamController = streamController;
        this.subscription = new StreamSubscription(streamController);
    }
    async add(data) {
        try {
            if (this.subscription.onData != null) {
                await this.subscription.onData(data);
            }
        }
        catch (err) {
            if (this.subscription.onError != null) {
                await this.subscription.onError(err, err.stack);
            }
        }
    }
    listen(onData, extraFns) {
        this.streamController.onListen();
        this.subscription.onData = onData;
        if (extraFns != null) {
            if (extraFns.onError != null) {
                this.subscription.onError = extraFns.onError;
            }
        }
        return this.subscription;
    }
}
exports.Stream = Stream;
