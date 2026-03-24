/**
 * download-index-images.js
 *
 * Downloads all 210 images from index.astro into
 * named project folders inside ./images/the-work/
 *
 * Usage: drop this file anywhere and run:
 *   node download-index-images.js
 *
 * No npm installs needed — uses only built-in Node modules.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, 'images', 'the-work');

// ── ALL 210 IMAGES — folder named by project ──────────────────────────────

const images = [
  // ringling (12)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/ea7d6176-8e6a-420e-854d-b9249a4980bb/GIF05-900.gif', folder: 'ringling' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/f9de1afa-3fbe-4d6b-9626-60c11cd2425f/GIF04-01.gif', folder: 'ringling' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/0422d98d-f2c1-4ed2-8139-f276170b5c1c/GIF07-01.gif', folder: 'ringling' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/28dfb8e1-aded-4e75-b7b6-02216d469f59/GIF12-01.gif', folder: 'ringling' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/cab29afe-2a77-4b8b-9f01-fc1b989e2d2f/GIF13-01.gif', folder: 'ringling' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/897d316c-81da-4d3b-871d-74de656b1f29/GIF14.gif', folder: 'ringling' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/e661d00d-8db7-48e9-92ee-4180d6be4cdf/GIF15-01.gif', folder: 'ringling' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/643929e5-c686-407d-9c2d-1e65be72de85/GIF16-01.gif', folder: 'ringling' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/14444f25-691a-415f-a53b-9b46e71ed525/GIF17-01.gif', folder: 'ringling' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/f9044ff2-3828-42f6-a2ce-b3c2038f5c95/GIF19-01.gif', folder: 'ringling' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/c0923f89-82ca-4af7-9cfa-0b905044a305/GIF20-01.gif', folder: 'ringling' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/ce116788-cfef-4f7c-8b06-c1197d4fb61f/GIF21-01.gif', folder: 'ringling' },
  // odin (8)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/db0412fd-0bd6-4205-9aaa-c22815b845b7/20210224_0139.jpg', folder: 'odin' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/153e0852-e3b0-4851-a3e9-3d5d9e8452e8/20210224_5134.jpg', folder: 'odin' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/0f5ce279-e4af-43a0-97a7-bc216354bb0b/20210224_0234.jpg', folder: 'odin' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/1db8d6d1-eafe-4c88-9b3d-16f091368d93/20210224_0384-2.jpg', folder: 'odin' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/4d5e3f61-8000-4a0f-861f-7cad4d0a4c66/20210224_0330.jpg', folder: 'odin' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/6f776cc8-f39f-4808-ad34-1d2441c14db2/20210224_5178.jpg', folder: 'odin' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/44979036-8eeb-4a9d-aadd-b4e9091b5a84/20210224_0276.jpg', folder: 'odin' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/2f7943b0-2f59-443a-b4ab-224d04c04b6d/20210224_0262.jpg', folder: 'odin' },
  // election (6)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/734af1ee-2901-4da2-9249-8b69b1464ac1/20180421_00060-2.jpg', folder: 'election' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/b7a48599-85cb-4088-b6f9-12974567d739/20180714_00121x.jpg', folder: 'election' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/d8ad8ff0-9127-45df-b246-e8044c2426c7/20180114_00123-2.jpg', folder: 'election' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/7c633d43-c450-4e2b-a84e-29039302680c/20180120_00135-2.jpg', folder: 'election' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/8dd4a584-83f8-4160-8eb8-8e3db9f4bc17/20180104_0118-5.jpg', folder: 'election' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/73acddb1-b4bf-499b-955a-de681f930a3f/20190618_0309x.jpg', folder: 'election' },
  // portraits (13)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/9546b990-270d-4594-8d04-e9136f62be44/20170604_0553.jpg', folder: 'portraits' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/6e849058-754a-4c30-a794-52209ed2d2ad/_MG_0030_100.jpg', folder: 'portraits' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/f2b80575-5379-4b32-8450-af1ce64548ff/_MG_0136_101.jpg', folder: 'portraits' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/6a3ed2b7-2a4b-4b1b-b768-ad3ac2a8797c/20200229_00249.jpg', folder: 'portraits' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/527bb7fe-0c01-4ab5-ae35-795e2fa1458d/_MG_4461_cover.jpg', folder: 'portraits' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/75c1f93b-8b51-497c-ba9f-bf183a719cc9/20151118_00067.jpg', folder: 'portraits' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/ec24390d-b62f-45b4-9ea9-8b38b3167844/20150227_1905.jpg', folder: 'portraits' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/a54f2f2a-fc68-42f7-94eb-06af87cd3f95/20200208_01057-V2.jpg', folder: 'portraits' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/d85acea8-ca19-45ea-a9f2-d487c27cfe19/_Z8I2398.jpg', folder: 'portraits' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/ba9046c9-3453-443c-b5d9-bb31c2e6ccf7/20200208_01596.jpg', folder: 'portraits' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/43cba233-510c-4287-978a-8fafbc30602a/curtain_100.jpg', folder: 'portraits' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/830d8705-e903-498f-9d43-e0d8055ba9cb/Justin_00999_V2.jpg', folder: 'portraits' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/d68d2e66-05b8-42f3-8bbb-6cca82fb895d/Table130531_0540_A.jpg', folder: 'portraits' },
  // ballardfc (14)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/480fe0a2-c8b9-4197-9f47-048413666197/20230516_0444.jpg', folder: 'ballardfc' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/8bf0b4ec-c7be-41ba-9434-f4dd91ae7cae/BFC_20230322_0082.jpg', folder: 'ballardfc' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/b999b6a6-4486-4b2a-89d4-ce6c8c06bc7d/20220517_0049-2.jpg', folder: 'ballardfc' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/797a0cda-ab33-4853-85f3-fe4b32c29422/BFC_MD_01.gif', folder: 'ballardfc' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/3ae43eaa-025a-48b9-ad89-b0bdd3a1906e/20220510_0149.jpg', folder: 'ballardfc' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/84427973-8dfd-4414-998e-6ad53658638f/BFC_20230327_0668.jpg', folder: 'ballardfc' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/4514f2be-efb5-45ca-8d81-9968d23b1762/20220620_0088.jpg', folder: 'ballardfc' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/7d47dcd1-d338-46ea-a00b-d748933155ae/BFC_20230322_0365.jpg', folder: 'ballardfc' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/65c1fed5-3593-4912-b6ae-2309fe78d777/20220601_0068.jpg', folder: 'ballardfc' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/adbcdacf-307a-4f03-a8a3-84e8ace46b1d/20240416_0017.jpg', folder: 'ballardfc' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/3992c4c0-d19e-4228-82f3-107c826ca4a4/20230516_0525.jpg', folder: 'ballardfc' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/9685d81b-1f72-4f02-b9a2-acd2eb6ee3b6/Bike-Kick_01.gif', folder: 'ballardfc' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/790499e4-985e-4b4d-96d9-a91054224f3f/BFC_20231204_283028.jpg', folder: 'ballardfc' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/c158dae4-d79e-494a-aaeb-bec4849a1a71/BFC_20231204_1600160.jpg', folder: 'ballardfc' },
  // jurassic (4)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/e92409a2-74cf-46e4-a7fa-03a192c6178f/JWLT_20190923_00179.jpg', folder: 'jurassic' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/ad533113-fd3f-4c76-85c9-c056182d0a6a/JWLT_20190923_00477.jpg', folder: 'jurassic' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/4bed015d-a91c-484c-91ec-ba3bce6dac86/JWLT_20190923_00648.jpg', folder: 'jurassic' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/885522d3-f84b-4e13-9fcf-e6256180d0e9/JWLT_20190923_00724.jpg', folder: 'jurassic' },
  // disney (10)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/e7c6afda-0128-4048-84fa-7da0be9b920e/D34_20140829_01234-Edit_v1_current_0.jpg', folder: 'disney' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/e9f9ab1b-f864-4be2-b253-c64057bbad9e/D26b201602773.jpg', folder: 'disney' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/1eb8524e-6829-4fc4-83f0-6a76c0b406d8/cindy.jpeg', folder: 'disney' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/846a22bd-aeef-4224-8e76-19dc5a3eb110/D35_20180904_00055_Edit.jpg', folder: 'disney' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/a795f041-abe6-42fc-8f74-f77805af3eb5/live.jpg', folder: 'disney' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/76803f7e-9b00-4ff9-b7ce-349d9976cce5/D36_20190906_01644_Edit.jpg', folder: 'disney' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/4ad1ef9f-9007-4a60-8e5b-3fb4c7b6fbd0/D36_20190809_00518_Edit.jpg', folder: 'disney' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/a56619ad-0d0e-4fc0-9d4e-593ea2b7068d/Micky_Minnie_Compass-1.jpg', folder: 'disney' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/bc0ff906-c1dd-4d60-af1b-47da46af7adc/D36_20190809_00427_Edit.jpg', folder: 'disney' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/0fd6ec9b-2b13-420e-8509-0b269d7aaf26/D35_Feld_Disney_2018_V13.jpg', folder: 'disney' },
  // badjimmys (14)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/43ef9cf2-4837-4ed1-a474-1cbe01051e84/Pour_01.gif', folder: 'badjimmys' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/0e0bcbaf-9d65-48bb-a8d0-6da2919f994a/Lift_01.gif', folder: 'badjimmys' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/4137687c-ed34-4b38-b0cf-9a6af1d9758e/20210519_0283.jpg', folder: 'badjimmys' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/58fbd33a-8fa6-4adf-a29e-f55cec6e8ad7/20210519_1070.jpg', folder: 'badjimmys' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/8a31587f-5ac3-442a-bb2e-9958a37f7e77/20210519_0077.jpg', folder: 'badjimmys' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/26289eef-a10c-49a0-ac8f-033d77ab24de/grain_01.gif', folder: 'badjimmys' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/c7ac1420-ec67-4260-b99d-add094c9c717/20220328_0522.jpg', folder: 'badjimmys' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/4f653451-8d71-4048-a4d1-729e4a825fe4/20210604_0908.jpg', folder: 'badjimmys' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/ea4a3c74-e2b4-4c7b-ae9c-a23c943427c6/20210519_0273.jpg', folder: 'badjimmys' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/96154d79-b462-4846-8f4a-a4604ba43305/20210519_1089.jpg', folder: 'badjimmys' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/a6fb93b0-02a3-4e75-ae0f-f242efc1311d/20210519_1534.jpg', folder: 'badjimmys' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/18f87450-2211-4bc1-b6e2-c79be88d7efc/20210604_0061.jpg', folder: 'badjimmys' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/4529a516-072b-4541-af4e-c6b8156db6ee/20210604_0274.jpg', folder: 'badjimmys' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/bf339f35-1559-4513-b38e-dc583d081690/Taster_001.gif', folder: 'badjimmys' },
  // katbell (12)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/549dafca-ac05-48e2-bb07-1b1d74f77900/20201204_0123.jpg', folder: 'katbell' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/56dbe1a2-cdfd-4792-a336-b7556ba5243e/20201205_0136.jpg', folder: 'katbell' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/bad265f1-69a6-4b3e-a493-a6711c79f42e/20201204_1008.jpg', folder: 'katbell' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/8138efeb-4cd4-4493-92a6-098df63c2691/20201205_1046.jpg', folder: 'katbell' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/4d92ad59-5926-41e1-97a8-219534793da0/20201205_0258.jpg', folder: 'katbell' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/911a999b-e971-4e96-b57a-6dcc80663dcc/20201204_0251.jpg', folder: 'katbell' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/2370ad48-2140-46dc-a950-718fd4578432/20201204_1077.jpg', folder: 'katbell' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/2b0d04e5-bdf1-4e9a-8061-900b7669ff75/20201205_0261.jpg', folder: 'katbell' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/ce438a58-cea2-4672-bfb8-de4c03d07259/20201205_0064.jpg', folder: 'katbell' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/58964db7-3a10-4691-b25c-482df7b738f6/20201205_0179.jpg', folder: 'katbell' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/92afd313-6d0b-4116-9e76-42a1eda7e8a4/20201205_1211.jpg', folder: 'katbell' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/6ffe9eff-3e33-4c94-864c-d9c4d27908f8/20201205_0246.jpg', folder: 'katbell' },
  // selfie (5)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/3d7029b0-b822-46a5-9487-82e64eea13dd/20190409_0543-Pano-2.jpg', folder: 'selfie' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/734a8e97-6d50-4ff4-b8a5-05914804125a/20110401_0221_V1.jpg', folder: 'selfie' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/05d57429-ab9d-4d2f-85e2-bb117ed8cfa9/20180310_00571-Pano-1.jpg', folder: 'selfie' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/c2d184eb-1e4c-4ade-8f2e-d86ea9f85337/20180926_0257-2.jpg', folder: 'selfie' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/b641657e-e739-49c9-b403-2e1223661099/Waikiki_V1.jpg', folder: 'selfie' },
  // editorial (18)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/9a911da2-464e-4aae-afea-d95d0ecb6975/20161116_0100.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/c1c1b4f9-a1ec-4f5c-b663-6fd13e2c2bac/GLD8_20150116_00876.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/aeaabf4c-4dd3-4215-b9b0-54eff01f4ba1/_MG_6984_200.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/5ca4cec6-aae7-4d69-b8c7-5c1867d14553/SM_20220321_0177.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/f5817f2e-8d5b-4b97-afe2-c0b482120694/20120531_0268.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/68de47a4-c43a-4b50-8b74-a0bc88ba8b33/20130507_0168.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/9662937a-796c-40f8-b0d2-d9a0dbdae4c4/20150227_1635.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/be4e303a-ee0a-4ca0-88f0-d92826b5fc98/20150227_1905.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/81ae6bc9-82b1-47a6-978f-daa560b8b1de/20221203_0185-V2.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/bef5647d-0082-4556-8070-b5dfb827b54c/20160324_1929.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/fc55c765-ccb5-47b6-a1fe-3a988a6a6ab0/Rosie-the-Riveter.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/c208c3af-e250-4c0e-868f-69f3d24ce5b7/20160728_0526.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/6c29310e-b3cf-49dc-91f0-48eeacd5edd6/SX17_20161103_00062-2.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/ba51517b-2f55-4fcb-b332-b4640dc3fbe4/20170414_0424.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/572f4012-9146-443f-9752-97729d6a7fba/20200216_00050.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/88bf8ada-3d8b-447d-8217-d536036072d7/Final_100.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/5c4d903e-341a-4c3d-a50b-56713ac92305/RD_20141202_0009.jpg', folder: 'editorial' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/9f04a541-c5e9-4dff-a0ba-b7298362b466/smoke_105.jpg', folder: 'editorial' },
  // moonlanding (3)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/5e62e53f-3b40-4161-8025-83ff774f15b5/walking_100.jpg', folder: 'moonlanding' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/9aa9fa1e-9850-459d-ba94-dac4777fbbb4/build_100.jpg', folder: 'moonlanding' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/7eeb5b19-c692-4a98-9df1-34d44c8d9263/flying_100.jpg', folder: 'moonlanding' },
  // marvel (5)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/3f6349d5-f888-4865-a898-a0bff73a8093/Marvel_2017_Position_Smoke_V10.jpg', folder: 'marvel' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/7c20cc36-fb45-4910-b570-990cde53c135/MUL_20140712_6609.jpg', folder: 'marvel' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/5ead9e56-a4e0-4e2f-8745-55662ae89881/MUL_20140707_4386.jpg', folder: 'marvel' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/d8b3469d-975f-4e78-affc-9f55197e9302/MUL2_20170624_10617.jpg', folder: 'marvel' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/29ce8002-583d-4182-9c07-e45b02229e5a/MUL2_20170624_11118.jpg', folder: 'marvel' },
  // sunglass (6)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/50927203-470c-46b0-b2dd-32f6f8e94195/Sunglasses0721.jpg', folder: 'sunglass' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/ea951a41-04f9-4316-8c49-f8acaa17afa8/Sunglasses0733.jpg', folder: 'sunglass' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/e6589877-8399-4e5b-8f00-bbfd4f9e4acf/Sunglasses0744.jpg', folder: 'sunglass' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/07636e51-a5a0-45d3-8a4a-0bab309a9cd1/Sunglasses0753.jpg', folder: 'sunglass' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/a8098116-1920-47e0-8144-2678a3a3f2f0/Sunglasses0764.jpg', folder: 'sunglass' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/b3abe4bc-72d4-44b6-a4fb-cc90b72b385e/Sunglasses0776.jpg', folder: 'sunglass' },
  // djhershe (11)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/7dbb3e1f-0e1c-445a-be5d-71518a1042d5/20200825_5240.jpg', folder: 'djhershe' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/093efae8-48f0-4aed-82c1-c3544a3f8007/20200825_5368.jpg', folder: 'djhershe' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/a5d4f1ea-37c5-48de-8d10-0578b8fbdb5c/20200825_0073.jpg', folder: 'djhershe' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/889c5d9b-e29c-4bf5-b068-6587521bfde5/20200825_0251.jpg', folder: 'djhershe' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/515c7419-e7e5-4611-af23-c56d15e2d4c7/20200825_0492.jpg', folder: 'djhershe' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/2af214d5-5411-42eb-867b-ebebcc9de7dc/20200825_0647.jpg', folder: 'djhershe' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/abefc228-9ba0-47bd-8532-1a09ccfce204/20200825_0858.jpg', folder: 'djhershe' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/bd62dfc8-6fa9-4ec3-a26e-9b6251a972db/20200825_5324.jpg', folder: 'djhershe' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/a8a371c0-0628-4624-8f42-192b444fa150/20200825_0886.jpg', folder: 'djhershe' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/6852057e-3dd3-46e1-92d3-b35f680de2c8/20200825_0474.jpg', folder: 'djhershe' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/e70c0a46-0138-477f-89a2-3e74fcfa23d0/20200825_1256.jpg', folder: 'djhershe' },
  // saratoga (10)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/4bb52d64-b5f0-4f76-a08b-96a2135be922/SunsetWake-01.gif', folder: 'saratoga' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/46262c74-bd9c-4947-9548-fbf0b0f0caca/20210610_2025.jpg', folder: 'saratoga' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/3d8a752f-57b2-481e-8658-7c7834a4f921/20210610_0359.jpg', folder: 'saratoga' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/361a7819-f00a-440e-abd2-5920a85fd349/20210610_0563.jpg', folder: 'saratoga' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/b7b2c645-5623-4b29-89e2-2ac4503bbc64/20210610_0693.jpg', folder: 'saratoga' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/1e816a4e-8e92-4b45-bae0-c1b7d31ead19/20210610_0935.jpg', folder: 'saratoga' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/fdfd1a7f-8c5c-4679-8624-347b56bbafa1/20210610_1684.jpg', folder: 'saratoga' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/3160eb38-1e22-49be-853f-812f112a4d24/Orcas_01.gif', folder: 'saratoga' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/022f4d47-38dc-401d-8f1b-4541c23e1790/20210610_1783.jpg', folder: 'saratoga' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/082d6b64-3882-42ec-a9f4-2dfb139f5728/20210610_1998.jpg', folder: 'saratoga' },
  // seasonone (5)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/9620aea9-953c-4383-b785-73a12dda13e1/20080210_0206_100.jpg', folder: 'seasonone' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/3556d0ed-85da-4d72-aca7-e46acc681135/20070203_0241_100.jpg', folder: 'seasonone' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/396e42cf-3cbf-447b-b160-3efe6f1781c7/20070922_0007_100.jpg', folder: 'seasonone' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/37e492b7-5a0c-464c-a05c-6c9dc87112b8/JB103_0925_A75057.jpg', folder: 'seasonone' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/dc76e289-0404-465c-b7b5-046df2b24d98/20071201_0269_100.jpg', folder: 'seasonone' },
  // night (13)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/6e313021-6b5d-4d4c-8b57-8225839b9fa0/20080413_0188.jpg', folder: 'night' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/82919219-c2cf-485d-a264-7a68ecc4e019/20090825_0116.jpg', folder: 'night' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/715fa665-8a60-4eed-abc0-6481cb62eb40/YNightPano2.jpg', folder: 'night' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/258c3d7d-9bcb-4d6c-9579-cc29d63da01e/MUL_131009_0115.jpg', folder: 'night' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/56c2ef51-282d-4191-8818-2cbd76e6ffa3/201011260279.jpg', folder: 'night' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/a6ad03ed-ba8e-4c49-8b46-6b209aa37cd4/20180311_00579-HDR.jpg', folder: 'night' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/181beeb9-3d93-4f26-ba9c-c65eeb2e577b/20130718_1006.png', folder: 'night' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/4576ba8e-26b2-4087-a795-b73c02b4d1e4/20110401_0234.jpg', folder: 'night' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/daf4f61a-4f57-4c5d-937a-7c7b5b5236f2/20100326_0008.jpg', folder: 'night' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/cf775fb8-4148-4722-826d-f5f9f83fb0f7/_MG_3766.jpg', folder: 'night' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/62ba0702-f761-4b5d-bfcb-2256eafc1c75/Star02.jpg', folder: 'night' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/1512258a-4d36-4ec5-b7da-95818e09cf23/20071024_0575x.jpg', folder: 'night' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/2307d43c-aac1-4cc0-863b-30aa0765bea2/20071022_0329.jpg', folder: 'night' },
  // wildchild (9)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/cf446fe6-f142-4a19-9448-ca572f2639f2/20180609_00209_x2.jpg', folder: 'wildchild' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/c2b0d505-b2e8-49e6-bc48-ca4d850cc158/20180408_00477.jpg', folder: 'wildchild' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/bcb944a6-ec14-4ac9-a7d3-a05fb7e1f65e/20180407_00130.jpg', folder: 'wildchild' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/bb98b7da-5feb-4277-af60-ec7a22d49dfe/20180609_00157_x.jpg', folder: 'wildchild' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/321a7792-32d0-45a3-907f-fffbd91b7213/20180407_00193-2.jpg', folder: 'wildchild' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/7ee2c3f0-7648-4387-b256-0e3ef04de0b7/20180407_00295-x.jpg', folder: 'wildchild' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/4277f152-ee91-49f5-8565-59b5294da21a/20180408_00375_x.jpg', folder: 'wildchild' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/6ddb0834-2270-433a-b6da-66971aea0ffd/20180408_00448_x.jpg', folder: 'wildchild' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/240ac42a-2729-4644-bdb1-6603608b4110/20180408_00603-x.jpg', folder: 'wildchild' },
  // chamberchoir (9)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/ea54d559-eff8-4918-a692-d7a006f2b5d7/ChoirProject_00324.jpg', folder: 'chamberchoir' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/0ec3746f-a8b6-4564-bf40-a6967ee9b9a5/ChoirProject_00050.jpg', folder: 'chamberchoir' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/f07e3c88-57de-4654-98f6-a66e327ec757/ChoirProject_00103.jpg', folder: 'chamberchoir' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/e9baf60a-608a-4804-8177-04ad0722c340/ChoirProject_00149.jpg', folder: 'chamberchoir' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/1e054f97-c467-4958-80c4-60e69bf1e0d8/ChoirProject_00196.jpg', folder: 'chamberchoir' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/2411511f-5d72-4de8-b41f-51589ab5d3f6/ChoirProject_00258.jpg', folder: 'chamberchoir' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/8b19d466-9e3e-4742-b3c3-3a81c92ccf4d/ChoirProject_00281.jpg', folder: 'chamberchoir' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/8c17d466-9e3e-4742-b3c3-3a81c92ccf4d/ChoirProject_00405.jpg', folder: 'chamberchoir' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/d485b170-3f23-4d2c-a59c-bddf2101613c/ChoirProject_00454.jpg', folder: 'chamberchoir' },
  // statefair (7)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/6aa99050-8953-4112-acd9-a2f171b92f80/Slide-2.gif', folder: 'statefair' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/4f23654b-d9ae-4b4d-957e-c9f38b42907b/Bungee-2-1.gif', folder: 'statefair' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/57a6e72c-7c78-49a1-a436-6957f73c1fa4/FW-2.gif', folder: 'statefair' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/d5fa0367-a06e-4a08-8a43-f11bdeefad28/PE-2.gif', folder: 'statefair' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/99553f37-b7c7-4cf7-bc5b-baf5afba606a/RC2-1.gif', folder: 'statefair' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/39c11658-083c-4df2-81f3-398dea690c0c/Swings.gif', folder: 'statefair' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/2b8b7b29-64cd-4e9c-972c-ebb461782cde/Tower-2.gif', folder: 'statefair' },
  // lottery (8)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/95aadb9b-f031-4411-add7-e23272f6570f/WAL_20151009_00112.jpg', folder: 'lottery' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/4219f880-e84a-46aa-b402-9bdc7ea1daa4/WAL_20151009_00475.jpg', folder: 'lottery' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/70587bba-a6d3-4a30-95e7-ff4742419c48/WAL_20151009_00553.jpg', folder: 'lottery' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/691910b6-b488-49a8-9c40-387bd92b2f4e/WAL_20151009_00625.jpg', folder: 'lottery' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/bd9ebdf1-fb74-464b-93fb-7e36dfc14bba/WAL_20151009_00179.jpg', folder: 'lottery' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/2c794e08-271c-445e-9cb4-c96a09804338/WAL_20151009_00434.jpg', folder: 'lottery' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/c30c92e6-8202-45d1-9128-32d0e4f497a4/WAL_20151009_00202.jpg', folder: 'lottery' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/1575cd6e-ce51-49b4-bab7-4ac1a378c0f6/WAL_20151009_00289.jpg', folder: 'lottery' },
  // freeskate (8)
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/52b324fd-41fa-43ad-a423-5effdab228a0/D32b_20171003_00158.jpg', folder: 'freeskate' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/830777c9-4f49-4c04-bfbb-e5acedb328aa/D32b_20171003_00381.jpg', folder: 'freeskate' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/b00be6a2-4fa8-4fea-8112-5e635c64c213/D32b_20171003_00296.png', folder: 'freeskate' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/e4c8b228-c3fb-474a-a806-e7179dda9552/D32b_20171003_00396.jpg', folder: 'freeskate' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/c20a8798-c9fe-47db-b342-0ee3292f65ce/D32b_20171003_00277.jpg', folder: 'freeskate' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/39684a84-2427-44ba-b674-9676269c5e58/D32b_20171003_00239.jpg', folder: 'freeskate' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/a490f32b-0594-4cc2-a8d1-884190be386a/D32b_20171003_00108.jpg', folder: 'freeskate' },
  { url: 'https://images.squarespace-cdn.com/content/v1/50c4bd4be4b0112a45d7e1e2/fb65cf37-262c-4b32-ba44-53164b86fb14/D32b_20171003_00188.jpg', folder: 'freeskate' },
];

// ── DOWNLOADER ────────────────────────────────────────────────────────────────

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath)) {
      return resolve({ skipped: true });
    }
    const file = fs.createWriteStream(destPath);
    const request = (targetUrl) => {
      https.get(targetUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
          return request(res.headers.location);
        }
        if (res.statusCode !== 200) {
          file.close();
          if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve({ skipped: false }); });
      }).on('error', (err) => {
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        reject(err);
      });
    };
    request(url);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── MAIN ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n📸 Downloading ${images.length} images from index.astro\n`);

  let downloaded = 0, skipped = 0, failed = 0;
  const failures = [];

  for (let i = 0; i < images.length; i++) {
    const { url, folder } = images[i];
    const filename = url.split('/').pop();
    const folderPath = path.join(OUTPUT_DIR, folder);
    const destPath = path.join(folderPath, filename);

    fs.mkdirSync(folderPath, { recursive: true });

    const progress = `[${String(i + 1).padStart(3)}/${images.length}]`;
    process.stdout.write(`${progress} ${folder}/${filename} ...`);

    try {
      const result = await download(url, destPath);
      if (result.skipped) {
        process.stdout.write(' ⏭  already exists\n');
        skipped++;
      } else {
        process.stdout.write(' ✅\n');
        downloaded++;
      }
    } catch (err) {
      process.stdout.write(` ❌ ${err.message}\n`);
      failures.push({ url, folder, filename, error: err.message });
      failed++;
    }

    await sleep(100);
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`✅ Downloaded : ${downloaded}`);
  console.log(`⏭  Skipped   : ${skipped} (already existed)`);
  console.log(`❌ Failed     : ${failed}`);
  console.log('─'.repeat(60));
  console.log(`\n📁 Saved to: images/the-work/\n`);

  if (failures.length > 0) {
    fs.writeFileSync('download-failures.json', JSON.stringify(failures, null, 2));
    console.log('⚠️  Failed URLs saved to download-failures.json\n');
  }

  console.log('📤 Next: upload images/the-work/ to your Cloudflare R2 bucket.\n');
}

main().catch(console.error);
