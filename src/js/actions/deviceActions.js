
import DEVICE from "../constants/deviceActions"

export function getPublicKeyTrezor() {
    console.log('ok');
    return {
        type: DEVICE.GET_PUBLIC,
    }
}
