"use client";

import React from "react";

export default function BentoGridSection() {
  return (
    <section id="amenities" className="py-16 bg-[#f8f2fa] w-full scroll-mt-20">
      <div className="px-4 md:px-12 max-w-[1280px] mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1d1b20]">Curated Experiences & Amenities</h2>
          <p className="text-[#494551] text-base leading-relaxed">
            Beyond accommodation, we offer a world of refined leisure, gourmet dining, and sensory delight designed to rejuvenate the soul.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          {/* Large Box: Spa */}
          <div className="md:col-span-2 md:row-span-2 group relative rounded-xl overflow-hidden aura-shadow min-h-[340px]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBa2VWT10YNJCX1T7mKDdm4IFyhK_I38RmfmQ7QwtEotrAQIC_pnjEKm57XR5Ca9oRVkX0nKwjcczwb0P8al_QRsKiFdomHAqUJAl2xzmVhfoaue2VHHBE9o1Ug1vfTkR8qX7nV6dqgwii8Ff0VMdjjIpdSF6VF7zfwYUqkUE_zUWHjofRfRF3MTfa-WaaI7jchZ6yfjm_5Ny8W7v1iG6Ox42F_3YVO-5WSpecO5uZCXCmyz46rb6u7oerbRzZpG0jQGbhln8ttJkn')",
              }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <h4 className="text-2xl md:text-3xl font-bold mb-2">The Celestial Spa</h4>
              <p className="text-sm md:text-base opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 max-w-md">
                Bespoke holistic treatments inspired by lunar cycles and ancient wellness traditions.
              </p>
            </div>
          </div>

          {/* Medium Box: Fine Dining (id="dining") */}
          <div id="dining" className="md:col-span-2 group relative rounded-xl overflow-hidden aura-shadow min-h-[260px] scroll-mt-24">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAgD7ggGODDttmY3LDrKQpQ6sImNY9pPRdLI0dXWBcw6MfoQLpJxoGPvZZ2Eo1f1X7GZCIc624mQjzxzER8Isplsq0fIn2QEomC2rZtCAzw00g0GqiV2Akj8_RHl0m8oG4TN1pwbbuS_gGEDZeLV-7mZfI5SRR_x247EYQFC4rbvrhMuSgmD9cAB0QYUtMt5PEP8FPgs8g3qfpQOKlN92VfxY3QB54dnO6fXCySNAUAKsVRkOq_VyxgKWX7nOmoIoV2vlCDDZyfaUot')",
              }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <h4 className="text-xl md:text-2xl font-bold mb-2">Aether Gastronomy (Fine Dining)</h4>
              <p className="text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                A Michelin-starred journey through local seasonal flavors and innovative techniques.
              </p>
            </div>
          </div>

          {/* Small Box: Infinity Pool */}
          <div className="group relative rounded-xl overflow-hidden aura-shadow min-h-[220px]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuALBp92ABzwh04IdHgwj2cl3Z-uEyMeiwe_Nira1S6EQMnI5woXQ2RymhSjNI7njfWWniK_588iUYXboLcNnGmQhn7W94plpEcyhdYij1NTVCcmVCbEe617964KRwOTixD1e87xwoyrXLJ89nlq_YOISM1GubHjtw10DZOV68CscobB6jt6WoUVm3LHUp6Nl6AlLh0ZOBa4X9bWQgArvMmMiQaH-QjmALGyII9oaat3vUfGZ_HPRUZPO9oW1TxL2y_frg7JuNIDaHPZ')",
              }}
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h4 className="text-lg md:text-xl font-bold">Infinity Pool</h4>
            </div>
          </div>

          {/* Small Box: Fitness Gym */}
          <div className="group relative rounded-xl overflow-hidden aura-shadow min-h-[220px]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuABeTdeEmjbHPH_i7Qz60XBDbzU4LdYWfo1tmBPXO7blZiTjxqQdQiRH4euwWkWPna-WGeRy1ZKewdIT0UpGVH91chsB3OQKNYm-miLqboyv6xmP2i-a5wVkPJzIFaWNYlIC94pKFheFMiCLTxbhhouvOl-dBGax8kzcCtTD9_ORxwUIDmA8CQCUnt0aHeFJlRpQTzt28CB2EvGUVFcWb_uCgnhFLW8hqiKtrg5q9ESF_2FYJnVtOrBsAUmHIsWnEguu9gnD6DwvJPJ')",
              }}
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h4 className="text-lg md:text-xl font-bold">Lumina Gym</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
