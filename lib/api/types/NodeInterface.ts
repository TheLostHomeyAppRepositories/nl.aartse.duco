export = NodeInterface;

interface NodeInterface {
    Node: number;
    General: {
        Type: {
            Val: string;
        };
        SubType: {
            Val: number;
        };
        NetworkType: {
            Val: string;
        };
        Parent: {
            Val: number;
        };
        Asso: {
            Val: number;
        };
        Name: {
            Val: string;
        };
        Identify: {
            Val: number;
        };
    };
    Ventilation: {
        State: {
            Val: string;
        }|undefined;
        TimeStateRemain: {
            Val: number;
        }|undefined;
        TimeStateEnd: {
            Val: number;
        }|undefined;
        Mode: {
            Val: string;
        }|undefined;
        FlowLvlTgt: {
            Val: number;
        }|undefined;
    }|undefined;
    Sensor: {
        IaqRh: {
            Val: number;
        }|undefined;
        IaqCo2: {
            Val: number;
        }|undefined;
    }|undefined;
}