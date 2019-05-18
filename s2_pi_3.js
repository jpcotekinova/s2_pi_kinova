class s2_pi {
    //Converted from https://jpcotekinova.github.io/s2_pi_kinova/s2_pi.js to Scratch 3.0 using Ext2to3!
    getInfo() {
        return {
            "id": "s2_pi",
            "name": "s2_pi",
            "blocks": [{
                "opcode": "cnct",
                "blockType": "command",
                "text": "Connect to s2_pi server.",
                "arguments": {}
            }, {
                "opcode": "connectToArm",
                "blockType": "command",
                "text": "Connect to Jaco2 Arm.",
                "arguments": {}
            }, {
                "opcode": "moveToPosition",
                "blockType": "command",
                "text": "MoveToPosition",
                "arguments": {}
            }, {
                "opcode": "moveToPosition2",
                "blockType": "command",
                "text": "MoveToPosition2- Angle1: %n, Angle2: %n, Angle3: %n, Angle4: %n, Angle5: %n, Angle6: [angle1]",
                "arguments": {
                    "angle1": {
                        "type": "number",
                        "defaultValue": "0.0"
                    }
                }
            }, {
                "opcode": "input",
                "blockType": "command",
                "text": "Set BCM [pin] as an Input",
                "arguments": {
                    "pin": {
                        "type": "number",
                        "defaultValue": "PIN"
                    }
                }
            }, {
                "opcode": "digital_write",
                "blockType": "command",
                "text": "Set BCM [pin] Output to [state]",
                "arguments": {
                    "pin": {
                        "type": "number",
                        "defaultValue": "PIN"
                    },
                    "state": {
                        "type": "string",
                        "menu": "high_low",
                        "defaultValue": "0"
                    }
                }
            }, {
                "opcode": "analog_write",
                "blockType": "command",
                "text": "Set BCM PWM Out [pin] to [value]",
                "arguments": {
                    "pin": {
                        "type": "number",
                        "defaultValue": "PIN"
                    },
                    "value": {
                        "type": "number",
                        "defaultValue": "VAL"
                    }
                }
            }, {
                "opcode": "servo",
                "blockType": "command",
                "text": "Set BCM [pin] as Servo with angle = [value] (0° - 180°)",
                "arguments": {
                    "pin": {
                        "type": "number",
                        "defaultValue": "PIN"
                    },
                    "value": {
                        "type": "number",
                        "defaultValue": "0"
                    }
                }
            }, {
                "opcode": "play_tone",
                "blockType": "command",
                "text": "Tone: BCM [pin] HZ: [frequency]",
                "arguments": {
                    "pin": {
                        "type": "number",
                        "defaultValue": "PIN"
                    },
                    "frequency": {
                        "type": "number",
                        "defaultValue": 1000
                    }
                }
            }, {
                "opcode": "digital_read",
                "blockType": "reporter",
                "text": "Read Digital Pin [pin]",
                "arguments": {
                    "pin": {
                        "type": "number",
                        "defaultValue": "PIN"
                    }
                }
            }, {
                "opcode": "socket_state_read",
                "blockType": "reporter",
                "text": "Socket state [state]",
                "arguments": {
                    "state": {
                        "type": "number",
                        "defaultValue": "state"
                    }
                }
            }, {
                "opcode": "socket_buffered_amount",
                "blockType": "reporter",
                "text": "Socket bufferedAmount [amount]",
                "arguments": {
                    "amount": {
                        "type": "number",
                        "defaultValue": "amount"
                    }
                }
            }],
            "menus": {
                high_low: this._formatMenu(['0', '1']),
            }
        };
    }
    cnct({
        callback
    }) {
        window.socket = new WebSocket("ws://127.0.0.1:9000");
        window.socket.onopen = function() {
            var msg = JSON.stringify({
                "command": "ready"
            });
            window.socket.send(msg);
            myStatus = 2;

            // change status light from yellow to green
            myMsg = 'ready';
            connected = true;

            // initialize the reporter buffer
            digital_inputs.fill('0');

            // give the connection time establish
            window.setTimeout(function() {
                callback();
            }, 1000);

        };

        window.socket.onmessage = function(message) {
            var msg = JSON.parse(message.data);

            // handle the only reporter message from the server
            // for changes in digital input state
            var reporter = msg['report'];
            if (reporter === 'digital_input_change') {
                var pin = msg['pin'];
                digital_inputs[parseInt(pin)] = msg['level']
            }
            console.log(message.data)
        };
        window.socket.onclose = function(e) {
            console.log("Connection closed.");
            socket = null;
            connected = false;
            myStatus = 1;
            myMsg = 'not_ready'
        };

        window.socket.onerror = function(e) {
            console.log("Connection closed.");
            socket = null;
            connected = false;
            myStatus = 1;
            myMsg = 'not_ready'
            callback();
        };
    }
    connectToArm({
        callback
    }) {
        var msg = JSON.stringify({
            "command": "connectToArm"
        });

        console.log("Begin more ConnectToArm")
        window.socket.send(msg);

        console.log("Begin ConnectToArm")

        window.setTimeout(function() {
            callback();
        }, 2000);

        console.log("After ConnectToArm")
    }
    moveToPosition({
        callback
    }) {
        var msg = JSON.stringify({
            "command": "moveToPosition"
        });
        window.socket.send(msg);

        callback();
    }
    moveToPosition2({
        angle1,
        angle2,
        angle3,
        angle4,
        angle5,
        angle6,
        callback
    }) {
        console.log("moveToPosition2");
        var msg = JSON.stringify({
            "command": 'moveToPosition2',
            'angle1': angle1,
            'angle2': angle2,
            'angle3': angle3,
            'angle4': angle4,
            'angle5': angle5,
            'angle6': angle6
        });
        console.log(msg);
        window.socket.send(msg);

        callback();
    }
    input({
        pin
    }) {
        if (connected == false) {
            alert("Server Not Connected");
        }
        // validate the pin number for the mode
        if (validatePin(pin)) {
            var msg = JSON.stringify({
                "command": 'input',
                'pin': pin
            });
            window.socket.send(msg);
        }
    }
    digital_write({
        pin,
        state
    }) {
        if (connected == false) {
            alert("Server Not Connected");
        }
        console.log("digital write");
        // validate the pin number for the mode
        if (validatePin(pin)) {
            var msg = JSON.stringify({
                "command": 'digital_write',
                'pin': pin,
                'state': state
            });
            console.log(msg);
            window.socket.send(msg);
        }
    }
    analog_write({
        pin,
        value
    }) {
        if (connected == false) {
            alert("Server Not Connected");
        }
        console.log("analog write");
        // validate the pin number for the mode
        if (validatePin(pin)) {
            // validate value to be between 0 and 255
            if (value === 'VAL') {
                alert("PWM Value must be in the range of 0 - 255");
            } else {
                value = parseInt(value);
                if (value < 0 || value > 255) {
                    alert("PWM Value must be in the range of 0 - 255");
                } else {
                    var msg = JSON.stringify({
                        "command": 'analog_write',
                        'pin': pin,
                        'value': value
                    });
                    console.log(msg);
                    window.socket.send(msg);
                }
            }
        }
    }
    servo({
        pin,
        value
    }) {
        if (connected == false) {
            alert("Server Not Connected");
        }
        console.log("servo");
        // validate the pin number for the mode
        if (validatePin(pin)) {
            // validate value to be between 0° and 180°
            if (value === 'VAL') {
                alert("Servo Value must be in the range of 0° - 180°");
            } else {
                value = parseInt(value);
                if (value < 0 || value > 180) {
                    alert("Servo Value must be in the range of 0° - 180°");
                } else {
                    var msg = JSON.stringify({
                        "command": 'servo',
                        'pin': pin,
                        'value': value
                    });
                    console.log(msg);
                    window.socket.send(msg);
                }
            }
        }
    }
    play_tone({
        pin,
        frequency
    }) {
        if (connected == false) {
            alert("Server Not Connected");
        }
        // validate the pin number for the mode
        if (validatePin(pin)) {
            var msg = JSON.stringify({
                "command": 'tone',
                'pin': pin,
                'frequency': frequency
            });
            console.log(msg);
            window.socket.send(msg);
        }
    }
    digital_read({
        pin
    }) {
        if (connected == false) {
            alert("Server Not Connected");
        } else {
            return digital_inputs[parseInt(pin)]

        }
    }
    socket_state_read({
        state
    }) {
        return window.socket.readyState
    }
    socket_buffered_amount({
        amount
    }) {
        return window.socket.bufferedAmount
    }
    _formatMenu(menu) {
        const m = [];
        for (let i = 0; i < menu.length; i++) {
            const obj = {};
            obj.text = menu[i];
            obj.value = i.toString();
            m.push(obj);
        }
        return m;
    }
}
Scratch.extensions.register(new s2_pi());