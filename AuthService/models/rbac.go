package models

type Role struct {
	Id          int    `json:"id,omitempty"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	CreatedAt   string `json:"created_at,omitempty"`
	UpdatedAt   string `json:"updated_at,omitempty"`
}

type Permission struct {
	Id          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Resource    string `json:"resource"`
	Action      string `json:"action"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

type RolePermission struct {
	RoleId                int64  `json:"role_id"`
	RoleName              string `json:"role_name"`
	RoleDescription       string `json:"role_description"`
	PermissionId          int64  `json:"permission_id"`
	PermissionName        string `json:"permission_name"`
	PermissionAction      string `json:"permission_action"`
	PermissionDescription string `json:"permission_description"`
	PermissionResource    string `json:"permission_resource"`
}
