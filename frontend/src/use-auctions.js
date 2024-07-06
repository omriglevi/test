import { useCallback, useEffect, useState } from 'react';
import { getAuctions, updateAuction } from './api';

const useAuctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [cursors, setCursors] = useState({ '0': null });

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await getAuctions();

                setAuctions(response.auctions);
                if (response.nextCursor) {
                    setCursors(prevCursors => ({
                        ...prevCursors,
                        '1': response.nextCursor
                    }));
                }
            } catch (error) {
                setAuctions([]);
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        if (page === 0 && auctions.length === 0) {
            fetchData();
        }
    }, [page, auctions.length]);

    const onChangePage = useCallback(async (newPage) => {
        setPage(newPage);
        setLoading(true);
        const cursor = cursors[newPage];
        const response = await getAuctions(cursor).catch(error => console.error(error)).finally(() => setLoading(false));

        setAuctions(response.auctions);

        if (response.nextCursor) {
            setCursors(prevCursors => ({
                ...prevCursors,
                [newPage + 1]: response.nextCursor
            }));
        }
    }, [cursors]);

    const updateAuctionField = useCallback(async (id, field, value) => {
        try {
            const response = await updateAuction(id, { [field]: value });
            if (response.error) {
                throw new Error(response.error);
            }

            const index = auctions.findIndex(auction => auction._id === id);
            if (index > -1) {
                throw new Error('Auction not found');
            }

            setAuctions(prevAuctions => {
                const updatedAuctions = [...prevAuctions];
                const index = updatedAuctions.findIndex(auction => auction._id === id);
                updatedAuctions[index] = { ...updatedAuctions[index], [field]: value };
                return updatedAuctions;
            });


        } catch (error) {
            console.error(error);
        }
    }, []);

    return {
        auctions,
        setAuctions,
        loading,
        setLoading,
        cursors,
        setCursors,
        updateAuctionField,
        onChangePage,
        setPage,
        page,
    };
}

export default useAuctions;
