import Image from "next/image"


type ProfileImageProps = {
    src?: string | null
    className?: string
}

export function ProfileImage({ src, className = ""}:
ProfileImageProps) {
    return <div className={`relative h-14 w-14 overflow-hidden rounded-full ${className}`}>
        {src == null ? <Image src={"../logo/Crib_.png"} alt="Crib Image" quality={100} fill/> : <Image src={src} alt="Profile Image" quality={100} fill />}
    </div>
}