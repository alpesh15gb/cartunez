import { Metadata } from 'next';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
    title: 'Your Account | CarTunez Premium Automotive',
    description: 'Manage your CarTunez profile, view order history, and track your premium automotive part deliveries.',
};

export default function ProfilePage() {
    return <ProfileClient />;
}
