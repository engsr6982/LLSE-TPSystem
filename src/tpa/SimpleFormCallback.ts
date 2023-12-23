type callback_ = () => void;

/**
 * 将回调与按钮绑定的表单类
 * @author Minimouse
 */
export class SimpleFormCallback {
    private fm: SimpleForm;
    private buttons: Array<Button>;

    constructor(title: string = "", content: string = "") {
        this.fm = mc.newSimpleForm();
        this.fm.setTitle(title);
        this.fm.setContent(content);
        this.buttons = [];
    }

    defaultCallback() {}

    /**
     * 添加一个按钮
     * @param name 按钮名
     * @param callback 回调函数
     */
    addButton(name: string, callback: callback_, image: string = undefined): void {
        this.buttons.push(new Button(name, callback, image));
        if (image != undefined) {
            this.fm.addButton(name, image);
        } else {
            this.fm.addButton(name);
        }
    }

    /**
     * 设置玩家点击关闭时的回调
     * @param callback 回调
     */
    set default(callback: callback_) {
        this.defaultCallback = callback;
    }

    buildCallback() {
        //由于下文callback作用域问题，需要将这两个变量传到方法内部
        const defaultCallback = this.defaultCallback;
        const buttons = this.buttons;
        return callback;
        /**
         * 这个函数里面不能直接调用this！
         * 因为作用域问题，如果想访问前面实例的成员，必须先方法开始把实例拷贝到方法内部变成方法内的局部变量
         * @param player 操作表单的玩家
         * @param id 玩家点击的按钮在表单上的次序
         * @returns
         */
        function callback(player: Player, id: number) {
            if (id == null) {
                //这里得传入this，因为已经脱离原来的类了
                defaultCallback();
            } else {
                buttons[id].callback();
            }
        }
    }

    /**
     * 向指定玩家发送表单
     * @param player 要发送给的玩家
     */
    send(player: Player) {
        player.sendForm(this.fm, this.buildCallback());
    }
}

class Button {
    private name: string;
    callback: callback_;
    private image: string;

    constructor(name: string, callback: callback_, image: string = undefined) {
        this.name = name;
        this.callback = callback;
        this.image = image;
    }
}
