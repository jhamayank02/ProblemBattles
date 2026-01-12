import Docker from 'dockerode';
import { CPP_IMAGE, PYTHON_IMAGE } from '../constants';
import logger from '../../config/logger.config';

export async function pullImage(image: string) {
    const docker = new Docker();

    return new Promise((res, rej) => {
        docker.pull(image, (error: Error, stream: NodeJS.ReadableStream) => {
            if (error) {
                rej(error);
                return;
            };

            docker.modem.followProgress(
                stream,
                function onFinished(finalErr, output) {
                    if (finalErr) return rej(finalErr);

                    return res(output);
                },
                function onProgress(event) {
                    console.log(event.status);
                },
            )
        })
    });
}

export async function pullAllImages() {
    const images = [PYTHON_IMAGE, CPP_IMAGE];

    // Parallely start pull both these images
    const promises = images.map(image => pullImage(image));

    try {
        await Promise.all(promises);
        logger.info("Pulled images successfully");
    } catch (err: any) {
        logger.error(`Error while pulling images: ${err.message}`);
    }
}