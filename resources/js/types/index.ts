import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string | null;
    mobile: string;
    role: 'admin' | 'student';
    [key: string]: unknown;
}

export interface RoutineItem {
    id: number;
    date: string;
    weekday: string;
    subject: string;
    task: string;
    position: number;
}
