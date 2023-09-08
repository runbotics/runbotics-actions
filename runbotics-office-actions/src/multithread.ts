import { DesktopRunRequest, DesktopRunResponse } from "@runbotics/runbotics-sdk";

export abstract class Multithread {
    abstract run(request: DesktopRunRequest): Promise<DesktopRunResponse>;
    abstract tearDown(): Promise<void>;
}