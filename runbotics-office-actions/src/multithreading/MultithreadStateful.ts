import { ActionHandler, DesktopRunRequest, DesktopRunResponse } from "@runbotics/runbotics-sdk";

export abstract class MultithreadStateful {
    abstract run(request: DesktopRunRequest): Promise<DesktopRunResponse>;

    getType(): string {
        return ActionHandler.StatefulMultithreaded;
    }

    abstract tearDown(): Promise<void>;
}