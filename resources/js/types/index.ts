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
    status?: string;
    [key: string]: unknown;
}

export interface AdminStudent {
    id: number;
    name: string;
    mobile: string;
    done: number;
    total: number;
}

export interface AdminDay {
    id: number;
    date: string;
    weekday: string;
    subject: string;
    task: string;
    position: number;
    ticks: number;
}

export interface User {
    id: number;
    name: string | null;
    mobile: string;
    role: 'admin' | 'student';
    [key: string]: unknown;
}

export interface StudentMark {
    id: number;
    label: string;
    done: boolean;
}

export interface Standing {
    id: number;
    rank: number;
    label: string;
    done: number;
    total: number;
    percent: number;
    isYou: boolean;
}

export interface RoutineItem {
    id: number;
    date: string;
    weekday: string;
    subject: string;
    task: string;
    position: number;
    canToggle: boolean;
    marks: StudentMark[];
}
