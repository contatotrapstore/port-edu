'use client';
import {usePathname} from 'next/navigation';
import {Analytics} from '@vercel/analytics/next';
import MetaPixel from './MetaPixel';
import AttributionInitializer from './AttributionInitializer';
export default function PublicTracking(){const path=usePathname();if(path==='/admin'||path.startsWith('/admin/'))return null;return <><AttributionInitializer/><Analytics/><MetaPixel/></>;}
