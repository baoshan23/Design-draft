import Image from 'next/image';

type Phone = { src: string; label: string };

/**
 * Product gallery: four phone mockups in an evenly-distributed row, all
 * the same size in the static state. Hovering (or keyboard-focusing) any
 * phone enlarges it.
 */
export default function Gallery3D({ phones }: { phones: Phone[] }) {
    return (
        <div className="gallery-row">
            {phones.slice(0, 4).map((p) => (
                <div key={p.src} className="g3d-phone" tabIndex={0} role="img" aria-label={p.label}>
                    <div className="g3d-device">
                        <div className="g3d-screen">
                            <Image
                                src={p.src}
                                alt=""
                                width={390}
                                height={844}
                                sizes="(max-width: 760px) 45vw, 260px"
                            />
                        </div>
                        <span className="g3d-notch" aria-hidden />
                    </div>
                </div>
            ))}
        </div>
    );
}
