(function () {
    'use strict';

    var View = Laya.View;
    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class FunctionNodeSlot_ViewUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("FunctionNodeSlot_View");
            }
        }
        ui.FunctionNodeSlot_ViewUI = FunctionNodeSlot_ViewUI;
        REG("ui.FunctionNodeSlot_ViewUI", FunctionNodeSlot_ViewUI);
        class FunctionNode_ViewUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("FunctionNode_View");
            }
        }
        ui.FunctionNode_ViewUI = FunctionNode_ViewUI;
        REG("ui.FunctionNode_ViewUI", FunctionNode_ViewUI);
        class MainPageUI extends Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("MainPage");
            }
        }
        ui.MainPageUI = MainPageUI;
        REG("ui.MainPageUI", MainPageUI);
    })(ui || (ui = {}));

    class FunctionNodeSlot_Runtime extends ui.FunctionNodeSlot_ViewUI {
        constructor() {
            super();
            this.m_Orientation = 0;
            this.m_ID = "";
            this.m_Line_List = new Map();
            this.on(Laya.Event.MOUSE_DOWN, this, this.On_Mouse_Down);
        }
        Update_Slot() {
            debugger;
            this.m_Slot_Name_Text.text = this.m_SlotName;
            if (this.m_Param_Type == "INT") {
                this.m_Slot_Type_Label.bgColor = "#000FA0";
            }
        }
        On_Mouse_Down(e) {
            e.stopPropagation();
            this.m_Main_Page_Panel.event("SLOT_CLICKED", [this.m_Node.m_ID, this.m_ID, this]);
        }
        onEnable() {
            this.Update_Slot();
        }
        onDisable() {
        }
    }

    class FunctionNode_Runtime extends ui.FunctionNode_ViewUI {
        constructor() {
            super();
            this.m_Mouse_Down = false;
            this.m_ID = "";
            this.m_Old_Mouse_Point_X = 0;
            this.m_Old_Mouse_Point_Y = 0;
            this.m_Slot_List = new Map();
        }
        SetNodeName(name) {
            this.m_Node_Name_Label.text = name;
        }
        Add_Slot(id, p_width, p_heigth, p_left, p_top, p_orientation) {
            let slot = new FunctionNodeSlot_Runtime();
            slot.m_Node = this;
            slot.m_ID = id;
            slot.width = p_width;
            slot.height = p_heigth;
            slot.m_Orientation = p_orientation;
            slot.top = p_top;
            slot.left = p_left;
            slot.m_Main_Page_Panel = this.m_Main_Page_Panel;
            this.addChild(slot);
            this.m_Slot_List.set(id, slot);
        }
        Update_Node() {
            this.m_Node_Background.width = this.width;
            this.m_Node_Background.height = this.height;
            this.repaint();
        }
        onEnable() {
            this.Update_Node();
            this.on(Laya.Event.MOUSE_DOWN, this, this.On_Mouse_Down);
            this.on(Laya.Event.MOUSE_UP, this, this.On_Mouse_Up);
            this.on(Laya.Event.MOUSE_MOVE, this, this.On_Mouse_Move);
        }
        On_Mouse_Down(e) {
            let x = this.mouseX;
            let y = this.mouseY;
            console.log(x + "-" + y);
            this.m_Old_Mouse_Point_X = x;
            this.m_Old_Mouse_Point_Y = y;
            this.m_Mouse_Down = true;
            this.captureMouseEvent(false);
            this.m_Clicked_Callback();
            e.stopPropagation();
            this.m_Main_Page_Panel.event("NODE_CLICKED", [this.m_ID, this]);
        }
        On_Mouse_Up(e) {
            this.m_Mouse_Down = false;
            this.releaseMouseEvent();
            e.stopPropagation();
        }
        On_Mouse_Move(e) {
            let x = this.mouseX;
            let y = this.mouseY;
            if (this.m_Mouse_Down === true) {
                let delta_x = 0;
                let delta_y = 0;
                delta_x = x - this.m_Old_Mouse_Point_X;
                delta_y = y - this.m_Old_Mouse_Point_Y;
                this.left += delta_x;
                this.top += delta_y;
                this.m_Main_Page_Panel.event("MAIN_PAGE_REPAINT_LINE");
            }
            e.stopPropagation();
        }
        onDisable() {
        }
    }

    class MainPage_Runtime_Toolbar_Init {
        constructor() {
            this.m_Last_Clicked_Slot = null;
        }
        Init() {
            this.m_MainPage_Runtime.m_Main_Panel.on("NODE_CLICKED", this, this.OnNodeClicked);
            this.m_MainPage_Runtime.m_Main_Panel.on("SLOT_CLICKED", this, this.OnSlotClicked);
            this.m_MainPage_Runtime.m_Node_Add_Button.on(Laya.Event.CLICK, this, this.OnAddNodeButtonClicked);
        }
        OnAddNodeButtonClicked() {
            let t_script = this.m_MainPage_Runtime.m_Node_Script_Text.text;
            let t_script_row_split = t_script.split("\n");
            let t_width = 300, t_height = 300;
            for (let row_i = 0; row_i < t_script_row_split.length; row_i++) {
                if (t_script_row_split[row_i].startsWith("@NODE_SIZE")) {
                    let t_temp_row_split = t_script_row_split[row_i].split(" ");
                    debugger;
                    t_width = parseInt(t_temp_row_split[1]);
                    t_height = parseInt(t_temp_row_split[2]);
                }
            }
            let l = this.m_MainPage_Runtime.m_Main_Panel.left;
            let t = this.m_MainPage_Runtime.m_Main_Panel.top;
            l = 1000 - l;
            t = 800 - t;
            l = l / this.m_MainPage_Runtime.m_Main_Panel.scaleX;
            t = t / this.m_MainPage_Runtime.m_Main_Panel.scaleY;
            let id = "NODE" + this.GetRandString();
            this.m_MainPage_Runtime.Add_Functon_Node(id, t_width, t_height, l, t);
            this.m_MainPage_Runtime.m_Node_List.get(id).SetNodeName(t_script_row_split[0]);
            this.m_MainPage_Runtime.m_Node_List.get(id).Update_Node();
            for (let row_i = 0; row_i < t_script_row_split.length; row_i++) {
                if (t_script_row_split[row_i].startsWith("@SLOT")) {
                    let slot_id = "SLOT" + this.GetRandString();
                    let t_temp_row_split = t_script_row_split[row_i].split(" ");
                    let t_left = parseInt(t_temp_row_split[1]);
                    let t_right = parseInt(t_temp_row_split[2]);
                    this.m_MainPage_Runtime.Add_Function_Slot(id, slot_id, 100, 100, t_left, t_right, 0);
                    let slot = this.m_MainPage_Runtime.m_Node_List.get(id).m_Slot_List.get(slot_id);
                    slot.m_SlotName = t_temp_row_split[3];
                    slot.m_SlotType = t_temp_row_split[4];
                    slot.m_Param_Type = t_temp_row_split[5];
                    slot.m_Param_Value = t_temp_row_split[6];
                    slot.m_Orientation = parseInt(t_temp_row_split[7]);
                    try {
                        this.m_MainPage_Runtime.m_Node_List.get(id).m_Slot_List.get(slot_id).Update_Slot();
                    }
                    catch (e) {
                    }
                }
            }
        }
        OnNodeClicked(id, instance) {
            this.m_MainPage_Runtime.m_Object_ID_Text.text = "NODE " + id;
        }
        OnSlotClicked(node, slot, instance) {
            if (this.m_MainPage_Runtime.m_Slot_Linking_Toggle.toggle) {
                if (this.m_Last_Clicked_Slot == null) {
                    this.m_Last_Clicked_Slot = instance;
                }
                else {
                    this.m_MainPage_Runtime.Add_Line("LINE" + this.GetRandString(), this.m_Last_Clicked_Slot.m_Node.m_ID, instance.m_Node.m_ID, this.m_Last_Clicked_Slot.m_ID, instance.m_ID);
                    this.m_Last_Clicked_Slot == null;
                    this.m_MainPage_Runtime.m_Main_Panel.event("MAIN_PAGE_REPAINT_LINE");
                }
            }
            this.m_MainPage_Runtime.m_Object_ID_Text.text = "SLOT " + node + ":" + slot;
        }
        GetRandString() {
            let CharArray = [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T",
                "U",
                "V",
                "W",
                "X",
                "Y",
                "Z",
            ];
            let res = "0x";
            for (let i = 0; i < 32; i++) {
                let c = Math.random() * 3600;
                c = parseInt(c.toFixed(0));
                c = c % 36;
                res = res + CharArray[c];
            }
            return res;
        }
    }

    class Function_Line {
    }

    class MainPage_Runtime extends ui.MainPageUI {
        constructor() {
            super();
            this.m_Node_List = new Map();
            this.m_Selected_Node_List = new Map();
            this.m_Line_List = new Map();
            this.m_Old_Mouse_Point_X = 0;
            this.m_Old_Mouse_Point_Y = 0;
            this.m_Mouse_Down = false;
            this.m_Toolbar_init = new MainPage_Runtime_Toolbar_Init();
            this.m_Toolbar_init.m_MainPage_Runtime = this;
            this.m_Toolbar_init.Init();
            this.m_Main_Panel.top = 0;
            this.m_Main_Panel.left = 0;
            this.m_Main_Panel.scale(1, 1);
            this.m_Main_Panel.on(Laya.Event.MOUSE_WHEEL, this, this.On_Panel_Mouse_Whell);
            this.m_Main_Panel.on("MAIN_PAGE_REPAINT_LINE", this, this.RepaintLines);
            this.m_InjectintButton.on(Laya.Event.CLICK, this, this.Inject);
            this.m_Main_Panel.on(Laya.Event.MOUSE_DOWN, this, this.On_Mouse_Down);
            this.m_Main_Panel.on(Laya.Event.MOUSE_UP, this, this.On_Mouse_Up);
            this.m_Main_Panel.on(Laya.Event.MOUSE_MOVE, this, this.On_Mouse_Move);
        }
        Set_Slot_Attributes(node_id, slot_id, Orientation = 0, Param_Type, Param_Value, SlotType) {
            let node = this.m_Node_List.get(node_id);
            if (node == null)
                return;
            let slot = node.m_Slot_List.get(slot_id);
            if (slot == null)
                return;
            slot.m_Orientation = Orientation;
            slot.m_Param_Type = Param_Type;
            slot.m_Param_Value = Param_Value;
            slot.m_SlotType = SlotType;
        }
        Add_Functon_Node(id, p_width, p_heigth, p_left, p_top) {
            let node = new FunctionNode_Runtime();
            node.m_ID = id;
            node.m_Clicked_Callback = function () { };
            node.m_Main_Page_Panel = this.m_Main_Panel;
            this.m_Node_List.set(id, node);
            this.m_Main_Panel.addChild(node);
            node.x = p_left;
            node.y = p_top;
            node.top = p_top;
            node.left = p_left;
            node.width = p_width;
            node.height = p_heigth;
        }
        DeleteNode(id) {
            let node = this.m_Node_List.get(id);
            this.m_Main_Panel.removeChild(node);
            this.m_Node_List.delete(id);
            node.m_Slot_List.forEach(element => {
                this.DeleteSlot(node.m_ID, element.m_ID);
            });
        }
        Add_Line(id, from_node, to_node, from_slot, to_slot) {
            let l = new Function_Line();
            l.m_ID = id;
            l.node_from = from_node;
            l.node_to = to_node;
            l.slot_from = from_slot;
            l.slot_to = to_slot;
            this.m_Line_List.set(id, l);
            this.m_Node_List.get(from_node).m_Slot_List.get(from_slot).m_Line_List.set(id, l);
            this.m_Node_List.get(to_node).m_Slot_List.get(to_slot).m_Line_List.set(id, l);
        }
        DeleteSlot(node_id, slot_id) {
            let node = this.m_Node_List.get(node_id);
            if (node == null)
                return;
            let slot = node.m_Slot_List.get(slot_id);
            if (slot == null)
                return;
            slot.m_Line_List.forEach(element => {
                this.Delete_Line(element.m_ID);
            });
            node.removeChild(slot);
            node.m_Slot_List.delete(slot_id);
        }
        DeleteLineOfSlot(node_id, slot_id) {
            let node = this.m_Node_List.get(node_id);
            if (node == null)
                return;
            let slot = node.m_Slot_List.get(slot_id);
            if (slot == null)
                return;
            slot.m_Line_List.forEach(element => {
                this.Delete_Line(element.m_ID);
            });
        }
        Delete_Line(id) {
            let l = this.m_Line_List.get(id);
            if (l == null)
                return;
            this.m_Node_List.get(l.node_from).m_Slot_List.get(l.slot_from).m_Line_List.delete(id);
            this.m_Node_List.get(l.node_to).m_Slot_List.get(l.slot_to).m_Line_List.delete(id);
            this.m_Line_List.delete(id);
        }
        Add_Function_Slot(node_id, slot_id, p_width, p_heigth, p_left, p_top, p_orientation) {
            this.m_Node_List.get(node_id).Add_Slot(slot_id, p_width, p_heigth, p_left, p_top, p_orientation);
        }
        On_Panel_Mouse_Whell(e) {
            let s_x = this.m_Main_Panel.scaleX;
            let s_y = this.m_Main_Panel.scaleY;
            let s_rate = (100.0 + e.delta) / 100.0;
            s_x = s_x * s_rate;
            s_y = s_x * s_rate;
            let panel_l = this.m_Main_Panel.left;
            let panel_t = this.m_Main_Panel.top;
            panel_l = panel_l - this.mouseX;
            panel_t = panel_t - this.mouseY;
            panel_l = panel_l * s_rate;
            panel_t = panel_t * s_rate;
            panel_l = panel_l + this.mouseX;
            panel_t = panel_t + this.mouseY;
            this.m_Main_Panel.left = panel_l;
            this.m_Main_Panel.top = panel_t;
            this.m_Main_Panel.scale(s_x, s_y);
            console.log(e);
        }
        onEnable() {
            let w = window;
            w.MAIN_PAGE = this;
            let sp = new Laya.Sprite();
            this.m_Canvas_Sprite = sp;
            this.m_Main_Panel.addChild(sp);
            this.m_Canvas_Sprite.mouseEnabled = false;
            this.m_Canvas_Sprite.graphics.clear();
            this.Add_Functon_Node("C", 300, 300, 100, 100);
        }
        Inject() {
            this.Add_Functon_Node("A", 300, 300, 100, 100);
            this.Add_Functon_Node("B", 300, 300, 300, 100);
            this.Add_Function_Slot("A", "SLOT0", 100, 100, 100, 100, 1);
            this.Add_Function_Slot("B", "SLOT0", 100, 100, 100, 100, 2);
        }
        On_Mouse_Down(e) {
            let x = this.m_Main_Panel.mouseX;
            let y = this.m_Main_Panel.mouseY;
            console.log(x + "-" + y);
            this.m_Old_Mouse_Point_X = x;
            this.m_Old_Mouse_Point_Y = y;
            this.m_Mouse_Down = true;
            this.m_Main_Panel.captureMouseEvent(false);
        }
        On_Mouse_Up(e) {
            this.m_Mouse_Down = false;
            this.m_Main_Panel.releaseMouseEvent();
        }
        On_Mouse_Move(e) {
            let x = this.m_Main_Panel.mouseX;
            let y = this.m_Main_Panel.mouseY;
            if (this.m_Mouse_Down === true) {
                let delta_x = 0;
                let delta_y = 0;
                delta_x = x - this.m_Old_Mouse_Point_X;
                delta_y = y - this.m_Old_Mouse_Point_Y;
                this.m_Main_Panel.left += delta_x;
                this.m_Main_Panel.top += delta_y;
            }
        }
        RepaintLines() {
            console.log("REPAINT");
            this.m_Canvas_Sprite.graphics.clear();
            let from_x, from_y, to_x, to_y;
            let from_delta_x, from_delta_y;
            let to_delta_x, to_delta_y;
            this.m_Line_List.forEach(element => {
                from_y = this.m_Node_List.get(element.node_from).top;
                from_x = this.m_Node_List.get(element.node_from).left;
                to_y = this.m_Node_List.get(element.node_to).top;
                to_x = this.m_Node_List.get(element.node_to).left;
                let slot_from = this.m_Node_List.get(element.node_from).m_Slot_List.get(element.slot_from);
                let slot_to = this.m_Node_List.get(element.node_to).m_Slot_List.get(element.slot_to);
                switch (slot_to.m_Orientation) {
                    case 0:
                        to_delta_x = 0;
                        to_delta_y = -10;
                        break;
                    case 1:
                        to_delta_x = 10;
                        to_delta_y = 0;
                        break;
                    case 2:
                        to_delta_x = 0;
                        to_delta_y = 10;
                        break;
                    case 3:
                        to_delta_x = -10;
                        to_delta_y = 0;
                        break;
                    default:
                        to_delta_x = 0;
                        to_delta_y = 0;
                }
                switch (slot_from.m_Orientation) {
                    case 0:
                        from_delta_x = 0;
                        from_delta_y = -10;
                        break;
                    case 1:
                        from_delta_x = 10;
                        from_delta_y = 0;
                        break;
                    case 2:
                        from_delta_x = 0;
                        from_delta_y = 10;
                        break;
                    case 3:
                        from_delta_x = -10;
                        from_delta_y = 0;
                        break;
                    default:
                        from_delta_x = 0;
                        from_delta_y = 0;
                }
                from_delta_y *= 10;
                from_delta_x *= 10;
                to_delta_y *= 10;
                to_delta_x *= 10;
                let slot_offset_from_x = slot_from.left + slot_from.width / 2;
                let slot_offset_from_y = slot_from.top + slot_from.height / 2;
                let slot_offset_to_x = slot_to.left + slot_to.width / 2;
                let slot_offset_to_y = slot_to.top + slot_to.height / 2;
                this.m_Canvas_Sprite.graphics.drawLine(from_x + slot_offset_from_x, from_y + slot_offset_from_y, to_x + slot_offset_to_x, to_y + slot_offset_to_y, "#0000ff", 5);
            });
        }
        onDisable() {
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("FunctionNode_Runtime.ts", FunctionNode_Runtime);
            reg("MainPage_Runtime.ts", MainPage_Runtime);
        }
    }
    GameConfig.width = 2560;
    GameConfig.height = 1920;
    GameConfig.scaleMode = "exactfit";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "MainPage.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
