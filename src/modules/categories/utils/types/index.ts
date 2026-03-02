export interface Category {
    id: string;
    user_id: string;
    name: string;
    type: string;
    color: string;
    created_at: string;
}

export interface CreateCategory {
    name: string;
    type: string;
    color: string;
    user_id: string;
}