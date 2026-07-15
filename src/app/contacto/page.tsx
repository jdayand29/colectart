import type { Metadata } from 'next'
import ContactForm from '@/components/forms/ContactForm'
import SubscribeForm from '@/components/forms/SubscribeForm'

export const metadata: Metadata = {
  title: 'Contacto — Joseph Dayan',
  description: 'Escribe directamente a Joseph Dayan o únete a la lista privada de nuevas obras.',
}

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <h1 className="mb-8 font-serif text-3xl font-semibold">Contacto</h1>
      <ContactForm />
      <div className="mt-10">
        <SubscribeForm />
      </div>
    </div>
  )
}
