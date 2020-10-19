import FunctionNodeSlot_Runtime from "./FunctionNodeSlot_Runtime";
import FunctionNode_Runtime from "./FunctionNode_Runtime";
import MainPage_Runtime from "./MainPage_Runtime";
import { ui } from "./ui/layaMaxUI";

export default class MainPage_Runtime_Toolbar_Init
{
    m_MainPage_Runtime:MainPage_Runtime;
    m_Last_Clicked_Slot:FunctionNodeSlot_Runtime=null;
    Init()
    {
        this.m_MainPage_Runtime. m_Main_Panel.on("NODE_CLICKED",this,this.OnNodeClicked);
        this.m_MainPage_Runtime. m_Main_Panel.on("SLOT_CLICKED",this,this.OnSlotClicked);
        this.m_MainPage_Runtime. m_Node_Add_Button.on(Laya.Event.CLICK,this,this.OnAddNodeButtonClicked);
    }

    OnAddNodeButtonClicked()
    {

        let t_script:string=this.m_MainPage_Runtime.m_Node_Script_Text.text;
        let t_script_row_split:string[]=t_script.split("\n");

        let t_width:number =300,t_height:number=300;
/*
@NODE01
@NODE_SIZE 400 200
@SLOT 0 120 S01 INPUT INT 0 0
*/
        for(let row_i=0;row_i<t_script_row_split.length;row_i++)
        {
            if(t_script_row_split[row_i].startsWith("@NODE_SIZE"))
            {
                let t_temp_row_split=t_script_row_split[row_i].split(" ");
                debugger;
                t_width=parseInt(t_temp_row_split[1]);
                t_height=parseInt(t_temp_row_split[2]);
            }
        }

        let l=this.m_MainPage_Runtime.m_Main_Panel.left;
        let t=this.m_MainPage_Runtime.m_Main_Panel.top;
        l=1000-l;
        t=800-t;
        l=l/this.m_MainPage_Runtime.m_Main_Panel.scaleX;
        t=t/this.m_MainPage_Runtime.m_Main_Panel.scaleY;
        let id="NODE"+this.GetRandString();
        this.m_MainPage_Runtime.Add_Functon_Node(
           id ,t_width,t_height,l,t
        );

        this.m_MainPage_Runtime.m_Node_List.get(id).SetNodeName(t_script_row_split[0]);
        this.m_MainPage_Runtime.m_Node_List.get(id).Update_Node();
        for(let row_i=0;row_i<t_script_row_split.length;row_i++)
        {
            if(t_script_row_split[row_i].startsWith("@SLOT"))
            {
                let slot_id="SLOT"+this.GetRandString();
                let t_temp_row_split=t_script_row_split[row_i].split(" ");
                let t_left=parseInt(t_temp_row_split[1]);
                let t_right=parseInt(t_temp_row_split[2]);
                this.m_MainPage_Runtime.Add_Function_Slot(id,slot_id,100,100,t_left,t_right,0);
                let slot:FunctionNodeSlot_Runtime=this.m_MainPage_Runtime.m_Node_List.get(id).m_Slot_List.get(slot_id);
                slot.m_SlotName=t_temp_row_split[3];
                slot.m_SlotType=t_temp_row_split[4];
                slot.m_Param_Type=t_temp_row_split[5];
                slot.m_Param_Value=t_temp_row_split[6];
                slot.m_Orientation=parseInt(t_temp_row_split[7]);
                try{
                    this.m_MainPage_Runtime.m_Node_List.get(id).m_Slot_List.get(slot_id).Update_Slot();
                }catch(e)
                {

                }
            }
        }

    }
    OnNodeClicked(id:string,instance :FunctionNode_Runtime)
    {
        this.m_MainPage_Runtime.m_Object_ID_Text.text="NODE "+id;
    }
    OnSlotClicked(node:string,slot:string,instance :FunctionNodeSlot_Runtime)
    {
        //debugger;
        if(this.m_MainPage_Runtime.m_Slot_Linking_Toggle.toggle)
        {
            if(this.m_Last_Clicked_Slot==null)
            {
                this.m_Last_Clicked_Slot=instance;
            }else{
                this.m_MainPage_Runtime.Add_Line( "LINE"+this.GetRandString(),
                    this.m_Last_Clicked_Slot.m_Node.m_ID,
                    instance.m_Node.m_ID,
                    this.m_Last_Clicked_Slot.m_ID,
                    instance.m_ID,
                );

                

                this.m_Last_Clicked_Slot==null;
                
                this.m_MainPage_Runtime.m_Main_Panel.event("MAIN_PAGE_REPAINT_LINE");
            }

        }
        this.m_MainPage_Runtime.m_Object_ID_Text.text="SLOT "+node+":"+slot;
    }
    GetRandString():string
    {
        let CharArray:Array<string>=[
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
    
    
        let res:string="0x";
        for(let i:number=0;i<32;i++)
        {

            let c=Math.random()*3600;
            c=parseInt(c.toFixed(0));
            c=c%36;
            res=res+CharArray[c];
        }
        return res;
    }

}