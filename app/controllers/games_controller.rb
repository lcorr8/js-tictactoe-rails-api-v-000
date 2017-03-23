require 'pry'
class GamesController < ApplicationController

  def new
    @game = Game.new
  end

  def create
    @game = Game.create(game_params)
    #binding.pry
    redirect_to games_path
  end

  def update
    #binding.pry
    @game = Game.find(params[:id])
    @game.update(game_params)
    render json: @game
  end

  def index
    @games = Game.all
    render json: @games
  end

  def show
    @game = Game.find(params[:id])
    render json: @game
  end

  private

  def game_params
    params.require(:game).permit(state: [])
  end

end