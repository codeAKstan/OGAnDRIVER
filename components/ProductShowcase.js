import Image from "next/image"

export default function ProductShowcase() {
  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Image
            src="/tricycle-lineup.png?height=300&width=800"
            alt="Tricycle lineup"
            width={800}
            height={300}
            className="w-full rounded-lg"
          />
        </div>
      </div>
    </section>
  )
}
