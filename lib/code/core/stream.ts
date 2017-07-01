interface ErrorHandlerFn {
    (err: any, stackTrace?: string): void
}

/**
 * See https://www.dartlang.org/articles/creating-streams/ for more details.
 */
export class StreamController<T> {
    stream: Stream<T>;
    onListenListener: () => void;
    onCancelListener: () => void;

    constructor({ onListen = () => {}, onCancel = () => {} } = {}) {
        this.stream = new Stream<T>(this);
        this.onListenListener = onListen;
        this.onCancelListener = onCancel;
    }

    add(data: T) {
        this.stream.add(data);
    }

    get onListen() {
        return this.onListenListener;
    }

    get onCancel() {
        return this.onCancelListener;
    }
}

export class StreamSubscription<T> {
    streamController: StreamController<T>;
    onData: (data?: T) => void;
    onError: ErrorHandlerFn;

    constructor(streamController: StreamController<T>) {
        this.streamController = streamController;
    }

    cancel() {
        this.streamController.onCancel();
        this.onData = null;
        this.onError = null;
    }
}

export class Stream<T> {
    streamController: StreamController<T>;
    subscription: StreamSubscription<T>;

    constructor(streamController: StreamController<T>) {
        this.streamController = streamController;
        this.subscription = new StreamSubscription<T>(streamController);
    }

    async add(data: T) {
        try {
            if (this.subscription.onData != null) {
                await this.subscription.onData(data);
            }
        } catch (err) {
            if (this.subscription.onError != null) {
                await this.subscription.onError(err, err.stack);
            }
        }
    }

    listen(onData: (data?: T) => void, extraFns?: {onError?: ErrorHandlerFn}) {
        this.streamController.onListen();
        this.subscription.onData = onData;

        if (extraFns != null) {
            if (extraFns.onError != null) {
                this.subscription.onError = extraFns.onError
            }
        }

        return this.subscription;
    }
}
