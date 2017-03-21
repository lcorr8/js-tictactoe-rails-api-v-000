require 'pry'
class GamesController < ApplicationController

  def new
    @game = Game.new
  end

  def create
    @game = Game.new(game_params)
    #binding.pry
    redirect_to games_path
  end

  def update
  end

  def index
    @games = Game.all
    render json: @games
  end

  private

  def game_params
    params.require(:game).permit(state: [])
  end

end