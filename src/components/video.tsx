"use client";
import { useState } from "react";
import { Play, X } from "lucide-react";
import type { Course } from "@/domain/catalog";
export function CourseVideo({
  video,
}: {
  video: NonNullable<Course["video"]>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="video-box">
      <div className="section-heading">
        <div>
          <h3>{video.title}</h3>
          <p>
            {video.demo ? "Video público de ejemplo de " : "Material de "}
            {video.author}.
            {video.demo && " No corresponde a la institución ni a la Cámara."}
          </p>
        </div>
      </div>
      {open ? (
        <>
          <iframe
            className="video-frame"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
            title={video.title}
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <button className="button secondary" onClick={() => setOpen(false)}>
            <X size={16} aria-hidden /> Cerrar video
          </button>
        </>
      ) : (
        <button className="button secondary" onClick={() => setOpen(true)}>
          <Play size={16} aria-hidden /> Cargar video de YouTube
        </button>
      )}
      <small>El reproductor externo se carga únicamente cuando lo abrís.</small>
    </div>
  );
}
