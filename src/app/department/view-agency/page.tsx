'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { activateAgencyAccount, deactivateAgencyAccountAPI, getAgenciesWithDiscom } from '@/app/api-calls/department/api';
import AuthUserReusableCode from '@/components/AuthUserReusableCode';
import { Pencil, UserCheck, UserX } from 'lucide-react';
import { testDiscom } from '@/lib/utils';
import ReactTable from '@/components/ReactTable';
import AlertPopup from '@/components/Agency/ViewAgency/AlertPopup';
import { useRouter } from 'next/navigation';

const ViewAgency = () => {
    const [search, setSearch] = useState('');
    const [agencyList, setAgencyList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getAgencyList();
    }, []);

    const getAgencyList = async () => {
        setIsLoading(true);
        try {
            const response = await getAgenciesWithDiscom(testDiscom);
            setAgencyList(
                response?.data?.map((item) => ({
                    id: item.id,
                    agencyName: item.agency_name,
                    agencyAddress: item.agency_address,
                    contactPerson: item.contact_person,
                    phone: item.phone,
                    maxLimit: item.maximum_limit,
                    woNumber: item.wo_number,
                    validity: item.validity_end_date,
                    divCode: item.divCode || 'N/A',
                    permissions: item.permissions || 'N/A',
                    collectionModes: item.collectionModes || 'N/A',
                    isActive: item.is_active,
                }))
            );
        } catch (error) {
            console.error('Failed to get agency:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const activateAgencyUser = async (id: number) => {
        setIsLoading(true);
        try {
            await activateAgencyAccount(id);
            toast.success('Agency activated successfully');
            getAgencyList();
        } catch (error) {
            console.error('Failed to activate agency:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deactivateAgencyUser = async (id: number) => {
        setIsLoading(true);
        try {
            await deactivateAgencyAccountAPI(id);
            toast.success('Agency deactivated successfully');
            getAgencyList();
        } catch (error) {
            console.error('Failed to deactivate agency:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const columns = useMemo(
        () => [
            { label: 'Action', key: 'action', sortable: false, ignored: true },
            { label: 'Agency ID', key: 'id', sortable: true },
            { label: 'Agency Name', key: 'agencyName', sortable: true },
            { label: 'Address', key: 'agencyAddress', sortable: true },
            { label: 'Contact Person', key: 'contactPerson', sortable: true },
            { label: 'Phone', key: 'phone', sortable: true },
            { label: 'Max Limit', key: 'maxLimit', sortable: true },
            { label: 'WO Number', key: 'woNumber', sortable: true },
            { label: 'Validity', key: 'validity', sortable: true },
            { label: 'Div Code', key: 'divCode', sortable: true },
            { label: 'Permissions', key: 'permissions', sortable: true },
            { label: 'Collection Modes', key: 'collectionModes', sortable: true },
        ],
        []
    );

    const router = useRouter();

    const handleEditAgency = (id: number) => {
        router.push(`/department/edit-agency?id=${id}`);
    }

    const tableData = agencyList.map((item, index) => ({
        ...item,
        action: item.isActive ? (
            <div className='flex gap-2'>
                <AlertPopup triggerCode={<UserX
                    className="cursor-pointer text-red-500"
                />} handleContinue={() => deactivateAgencyUser(item.id)}
                    title='Confirm Deactivating' description='Are you sure you want to save the deactivate agent? Please review the details carefully before confirming.' continueButtonText='Confirm'
                />
                <Pencil className='cursor-pointer' onClick={() => handleEditAgency(item.id)} />
            </div>
        ) : (
            <div className='flex gap-2'>
                <AlertPopup triggerCode={<UserCheck
                    className="cursor-pointer text-green-500"
                />} handleContinue={() => activateAgencyUser(item.id)}
                    title='Confirm Deactivating' description='Are you sure you want to save the deactivate agent? Please review the details carefully before confirming.' continueButtonText='Confirm'
                />
                <Pencil className='cursor-pointer' onClick={() => handleEditAgency(item.id)} />
            </div>
        ),
    }));

    return (
        <AuthUserReusableCode pageTitle="View Agency" isLoading={isLoading}>

            <ReactTable
                data={tableData.filter((item) =>
                    item.agencyName.toLowerCase().includes(search.toLowerCase())
                )}
                columns={columns}
            />
        </AuthUserReusableCode>
    );
};

export default ViewAgency;
