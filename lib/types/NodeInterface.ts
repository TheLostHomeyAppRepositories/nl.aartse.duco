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
        };
        TimeStateRemain: {
            Val: number;
        };
        TimeStateEnd: {
            Val: number;
        };
        Mode: {
            Val: string;
        };
        FlowLvlTgt: {
            Val: number;
        };
    };
    Sensor: {
        IaqRh: {
            Val: number;
        };
    };
}