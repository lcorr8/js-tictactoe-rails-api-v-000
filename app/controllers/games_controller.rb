class GamesController < ApplicationController

 def create
 end

 def update
 end

 def index
  @games = Game.all
  render json: @games
 end

end