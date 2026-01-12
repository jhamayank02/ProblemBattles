import logger from "../../config/logger.config";
import Docker from 'dockerode';

export interface CreateContainerOptions {
    imageName: string;
    cmdExecutable: string[];
    memoryLimit: number;
}

export async function createNewDockerContainer(options: CreateContainerOptions) {
    try {
        const docker = new Docker();

        const container = await docker.createContainer({
            Image: options.imageName,
            Cmd: options.cmdExecutable,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: false,
            OpenStdin: true,
            HostConfig: {
                // AutoRemove: true,
                Memory: options.memoryLimit,
                PidsLimit: 100,
                CpuQuota: 50000,
                CpuPeriod: 100000,
                SecurityOpt: ['no-new-privileges'],
                NetworkMode: 'none'
            }
        });

        logger.info(`Container created with id ${container.id}`);
        return container;
    } catch (error) {
        logger.error("Error creating new docker container", error);
        return null;
    }
}