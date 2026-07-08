import { redirect } from 'next/navigation';

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`https://app.rentalhub.ng/properties/${id}`);
}
