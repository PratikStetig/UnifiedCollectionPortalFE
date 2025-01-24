"use client";

import React from 'react';
import { Session } from 'next-auth';
import { User2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
// import { handleSignOut } from '@/app/actions/authActions';

interface UserClientProps {
    session: Session | null;
}

const UserClient: React.FC<UserClientProps> = ({ session }) => {
    const router = useRouter();

    const onSignOut = async () => {
        // await handleSignOut();
    };
    if (session?.user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-4 border">
                        <User2 className="w-6 h-6" />
                        <div className="flex flex-col">
                            <span className='font-semibold'>{session.user.name}</span>
                            <span className='text-gray-500 text-xs text-start'>{session.user.mobileNumber}</span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                        <button type="button" onClick={() => onSignOut()} className="w-full text-left">
                            Sign Out
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Link href="/auth/signin">
            <Button variant="outline" className="flex items-center space-x-2 w-full">
                <User2 className="w-4 h-4" />
                <span>Sign in</span>
            </Button>
        </Link>
    );
};

export default UserClient;