export interface AuthUser {
  id: string;
  schoolId: string | null;
  roles: string[];
  permissions: string[];
  departments: Array<{
    id: string;
    code: string;
    moduleKey: string;
    isHod: boolean;
  }>;
}
