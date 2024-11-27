import {web} from "./application/web.js";
import {logger} from "./application/logging.js";
import fs from 'fs';
import path from 'path';

const profileImageDir = path.join(process.cwd(), 'public', 'profile-images');
if (!fs.existsSync(profileImageDir)){
    fs.mkdirSync(profileImageDir, { recursive: true });
}

web.listen(3000, () => {
    logger.info("Server started...");
})