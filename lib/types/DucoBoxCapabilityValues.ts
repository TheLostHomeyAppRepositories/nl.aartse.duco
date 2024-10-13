export = DucoBoxCapabilityValues;

interface DucoBoxCapabilityValues {
    ventilationState: string|null
    ventilationTimeStateRemain: number|null
    ventilationTimeStateEnd: string|null
    ventilationMode: string|null
    ventilationFlowLevelTarget: number|null
    sensorAirQualityRH: number|null
    sensorAirQualityCO2: number|null
}