export = DucoBoxCapabilityValues;

interface DucoBoxCapabilityValues {
    ventilationState: string|null
    ventilationTimeStateRemain: number|null
    ventilationTimeStateEnd: string|null
    ventilationMode: string|null
    ventilationFlowLevelTarget: number|null
    sensorRH: number|null
    sensorAirQualityRH: number|null
    sensorCO2: number|null
    sensorAirQualityCO2: number|null
}