'use client';
import React from 'react'
import FavoritesGrid from './FavoritesGrid'
import { useAppSelector } from '@/redux/hooks';
import { selectAllFavorites } from '@/redux/slices/favoriteSlice';

type Props = {}

const FavoritesPage = (props: Props) => {
    const favorites = useAppSelector(selectAllFavorites);

    return (
        <FavoritesGrid favorites={favorites} />
    )
}

export default FavoritesPage