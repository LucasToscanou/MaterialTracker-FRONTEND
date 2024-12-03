export const backendAddress = ' http://127.0.0.1:8080/';
export const tokenKeyword = 'Token ';



export interface UserProfile {
    id: number;
    user: string; // User's email or username
    avatar: string; // URL to the avatar image
}

export interface Project {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Location {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Material {
    // id: number;
    ref: string;
    description: string;
    project: number; // Project ID
    // main_img: string; // URL to the main image
    current_location: number; // Location ID
    cost: number;
    currency: number; // Currency ID
    quality_exp_date: string;
}


export interface MaterialImg {
    id: number;
    material: number; // Material ID
    img: string; // URL to the image
    created_at: string;
    updated_at: string;
}

export interface Currency {
    id: number;
    name: string;
    description: string;
    dolar_value: number;
    created_at: string;
    updated_at: string;
}