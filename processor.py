import io
import zipfile
import logging

from PIL import Image, ImageOps
from typing import List, Tuple, Dict


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("VirtualsoftVision")


class ImageProcessor:

    TARGET_SQUARE = (460, 460)
    TARGET_RECT = (725, 460)
    MAX_FILE_SIZE_KB = 200


    @classmethod
    def smart_resize(
        cls,
        img: Image.Image,
        target_size: Tuple[int, int]
    ) -> Image.Image:

        return ImageOps.pad(
            img,
            target_size,
            method=Image.Resampling.LANCZOS,
            color="#000000",
            centering=(0.5, 0.5)
        )


    @classmethod
    def compress_adaptive(
        cls,
        img: Image.Image
    ) -> bytes:

        quality = 95
        buffer = io.BytesIO()

        while quality >= 10:

            buffer.seek(0)
            buffer.truncate()

            img.save(
                buffer,
                format="JPEG",
                quality=quality,
                optimize=True
            )

            size_kb = buffer.tell() / 1024

            if size_kb <= cls.MAX_FILE_SIZE_KB:
                break

            quality -= 5

        return buffer.getvalue()


    @classmethod
    async def process_batch(
        cls,
        files: List[Tuple[str, bytes]]
    ) -> Tuple[bytes, Dict[str, int]]:

        zip_buffer = io.BytesIO()

        stats = {
            "CUADRADAS": 0,
            "RECTANGULARES": 0,
            "PROCESADAS": 0,
            "ERRORES": 0
        }

        with zipfile.ZipFile(
            zip_buffer,
            "w",
            zipfile.ZIP_DEFLATED
        ) as zip_file:

            for filename, content in files:

                try:

                    img = Image.open(io.BytesIO(content))

                    if img.mode != "RGB":
                        img = img.convert("RGB")

                    base_name = filename.rsplit(".", 1)[0]

                    # CUADRADA
                    square = cls.smart_resize(
                        img,
                        cls.TARGET_SQUARE
                    )

                    square_bytes = cls.compress_adaptive(square)

                    zip_file.writestr(
                        f"CUADRADAS/{base_name}.jpg",
                        square_bytes
                    )

                    stats["CUADRADAS"] += 1


                    # RECTANGULAR
                    rect = cls.smart_resize(
                        img,
                        cls.TARGET_RECT
                    )

                    rect_bytes = cls.compress_adaptive(rect)

                    zip_file.writestr(
                        f"RECTANGULARES/{base_name}.jpg",
                        rect_bytes
                    )

                    stats["RECTANGULARES"] += 1

                    stats["PROCESADAS"] += 1


                except Exception as e:

                    stats["ERRORES"] += 1

                    logger.error(
                        f"Error processing {filename}: {str(e)}"
                    )


        zip_buffer.seek(0)

        zip_bytes = zip_buffer.read()

        logger.info(
            f"ZIP generado correctamente: {len(zip_bytes)} bytes"
        )

        return zip_bytes, stats
