package dto

type CreateUserDTO struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
	Username string `json:"username" validate:"required,min=2"`
}

type LoginUserDTO struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type UserIdDTO struct {
	UserId int `json:"userId" validate:"required"`
}

type UserEmailDTO struct {
	Email string `json:"email" validate:"required,email"`
}
