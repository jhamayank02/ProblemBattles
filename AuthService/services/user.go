package services

import (
	db "AuthService/db/repositories"
	"AuthService/models"
	"AuthService/utils"
	"context"
	"errors"
)

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
)

type UserService interface {
	GetById(ctx context.Context, id string) (*models.User, error)
	GetByEmail(ctx context.Context, email string) (*models.User, error)
	Create(ctx context.Context, username string, email string, password string) (*models.User, error)
	GetAll(ctx context.Context) ([]*models.User, error)
	DeleteById(ctx context.Context, id string) (bool, error)
	LoginUser(ctx context.Context, email string, password string) (string, error)
	ValidateUserSession(ctx context.Context, email string, id int) (string, error)
}

type UserServiceImpl struct {
	UserRepository db.UserRepository
}

func NewUserService(_userRepository db.UserRepository) UserService {
	return &UserServiceImpl{
		UserRepository: _userRepository,
	}
}

func (s *UserServiceImpl) GetById(ctx context.Context, id string) (*models.User, error) {
	user, err := s.UserRepository.GetById(ctx, id)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserServiceImpl) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	user, err := s.UserRepository.GetByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *UserServiceImpl) Create(ctx context.Context, username string, email string, password string) (*models.User, error) {
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return nil, db.ErrInternalServerError
	}

	user, err := s.UserRepository.Create(ctx, username, email, hashedPassword)
	return user, err
}

func (s *UserServiceImpl) GetAll(ctx context.Context) ([]*models.User, error) {
	users, err := s.UserRepository.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserServiceImpl) DeleteById(ctx context.Context, id string) (bool, error) {
	isDeleted, err := s.UserRepository.DeleteById(ctx, id)
	return isDeleted, err
}

func (s *UserServiceImpl) LoginUser(ctx context.Context, email string, password string) (string, error) {
	user, err := s.UserRepository.GetByEmail(ctx, email)
	if err != nil {
		return "", err
	}

	isPasswordMatched := utils.CheckPassword(user.Password, password)
	if !isPasswordMatched {
		return "", ErrInvalidCredentials
	}

	token, err := utils.CreateJwtToken(int(user.Id), user.Email)
	if err != nil {
		return "", db.ErrInternalServerError
	}

	return token, nil
}

func (s *UserServiceImpl) ValidateUserSession(ctx context.Context, email string, id int) (string, error) {
	token, err := utils.CreateJwtToken(id, email)
	if err != nil {
		return "", db.ErrInternalServerError
	}

	return token, nil
}
