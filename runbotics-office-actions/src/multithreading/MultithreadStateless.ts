import { ActionHandler, DesktopRunRequest, DesktopRunResponse } from "@runbotics/runbotics-sdk";

export abstract class MultithreadStateless {
    abstract run(request: DesktopRunRequest): Promise<DesktopRunResponse>;

    getType(): string {
        return ActionHandler.StatelessMultithreaded;
    }
}