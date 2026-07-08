import { redirect } from 'next/navigation';

export default function PropertyPage({ params }: { params: { id: string } }) {
  redirect(`https://app.rentalhub.ng/properties/${params.id}`);
}
